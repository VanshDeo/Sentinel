# File: 01-system-architecture.md

# Sentinel — System Architecture

## 1. High-Level Architecture

Sentinel is composed of four cooperating layers: a **frontend dashboard**, a **backend policy/indexing service**, a set of **smart contracts** on Avalanche Fuji, and the **Safe multisig** it extends. Sentinel never replaces Safe — it observes and gates it.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                    │
│   Safe-connected dashboard · Policy config · Audit viewer    │
└───────────────┬───────────────────────────────┬──────────────┘
                │ REST/JSON                     │ Viem/Wagmi (direct chain reads)
                ▼                               ▼
┌───────────────────────────────┐   ┌───────────────────────────────┐
│      BACKEND (Fastify)         │   │   BLOCKCHAIN (Avalanche Fuji)  │
│  Policy Checker · Indexer      │◄──┤  SentinelModule · PolicyEngine │
│  Audit Key Coordinator          │   │  TreasuryManager · AuditRegistry│
│  Prisma / PostgreSQL            │──►│  (via Safe module hooks)       │
└───────────────────────────────┘   └───────────────┬────────────────┘
                                                     │
                                                     ▼
                                          ┌───────────────────────┐
                                          │   Safe Multisig (N-of-M)│
                                          │   + eERC token contracts│
                                          └───────────────────────┘
```

## 2. Component Architecture

| Component | Responsibility |
|---|---|
| **Frontend App** | Signer/admin/auditor UI. Talks to backend for policy config, proposal status, and audit reconstruction; talks to chain directly for wallet connect, signing, and read-only contract state. |
| **Backend API** | Stateless policy evaluation, off-chain indexing of on-chain events, audit-log persistence, view-key-scoped decryption for policy checks. Never holds the full auditor key. |
| **SentinelModule (contract)** | Safe module entry point. Intercepts proposals via Safe's guard hooks before execution. |
| **PolicyEngine (contract)** | Stores public policy rules (caps, allowlists). Emits pass/fail events consumed by backend and frontend. |
| **TreasuryManager (contract)** | Wraps/unwraps treasury funds into eERC (converter mode); tracks pending batch. |
| **AuditRegistry (contract)** | Stores commitment hashes and rejection reason codes for later reconciliation with off-chain decrypted logs. |
| **Safe Multisig** | Unmodified N-of-M signing. Sentinel hooks into it; does not fork it. |

## 3. Frontend Architecture

Next.js 15 App Router, organized by route group rather than by technical layer, so each user role (signer, admin, auditor) has a clear home:

- **Route groups:** `(dashboard)`, `(policy)`, `(audit)`, `(auth)` — see `02-folder-structure.md` for the full tree.
- **State:** TanStack Query owns all server/chain-derived state (proposals, balances, policy rules); Zustand owns local UI/session state (active wallet, active org, wizard steps). These are never mixed.
- **Forms:** React Hook Form + Zod schemas shared between client validation and backend request validation (see `05-api.md`), so a rule is only ever written once.
- **Chain access:** Wagmi hooks wrap Viem clients for wallet connection, contract reads, and transaction submission. All contract ABIs live in a shared package (`packages/contracts-sdk`) consumed by both frontend and backend.

## 4. Backend Architecture

Fastify service, structured around three internal modules that map 1:1 to Sentinel's three core capabilities:

- **Policy Service** — decrypts proposed amounts using a scoped view key (never the full auditor key), evaluates against on-chain public rules, writes pass/fail back on-chain via `PolicyEngine`.
- **Indexer Service** — listens to on-chain events (`TransferProposed`, `PolicyChecked`, `BatchSettled`) and persists a queryable off-chain mirror in PostgreSQL for fast dashboard reads.
- **Audit Service** — coordinates client-submitted Shamir shares (received, never stored), performs no server-side reconstruction, and returns decrypted history only for the requesting session once 2-of-3 shares are validated client-side. See `11-security.md` for the precise trust boundary.

The backend is intentionally **not** a source of truth — on-chain contract state and events are canonical; PostgreSQL is a performance and query cache, rebuildable from chain history at any time.

## 5. Blockchain Architecture

Four contracts, each with a single responsibility (full detail in `06-smart-contracts.md`):

```
Safe Multisig
   │  (guard hook)
   ▼
SentinelModule ──calls──► PolicyEngine (pass/fail)
   │                            │
   │                            ▼
   │                     AuditRegistry (commitment log)
   ▼
TreasuryManager ──wraps/unwraps──► eERC Token Contracts
```

## 6. Data Flow (Proposal → Settlement)

```
Signer proposes transfer
        │
        ▼
SentinelModule emits TransferProposed(id, recipient, commitmentHash)
        │
        ▼
Backend Policy Service decrypts (view key) → checks PolicyEngine rules
        │
   ┌────┴────┐
   ▼         ▼
 PASS       FAIL
   │         └──► AuditRegistry logs encrypted reason, signer never sees it
   ▼
Normal Safe N-of-M approval flow unlocked
        │
        ▼
Approved transfer joins pendingBatch[]
        │
        ▼
Batch trigger (time or count) → executeBatch()
        │
        ▼
eERC transfers settle together, one on-chain tx
```

## 7. Service Communication

- **Frontend ↔ Backend:** REST/JSON over HTTPS, authenticated via wallet-signature session (see `05-api.md`).
- **Frontend ↔ Chain:** Direct via Wagmi/Viem for wallet connect, signing, and read calls — never proxied through the backend.
- **Backend ↔ Chain:** Viem client for event listening (indexer) and transaction submission (policy check results).
- **Backend ↔ Database:** Prisma ORM, single PostgreSQL instance, no cross-service DB sharing.

## 8. Layered Architecture

```
┌───────────────────────────┐
│  Presentation (Next.js)    │  ← what the user sees and signs
├───────────────────────────┤
│  Application (Fastify API) │  ← policy logic, indexing, audit coordination
├───────────────────────────┤
│  Domain (Smart Contracts)  │  ← source of truth, enforced on-chain
├───────────────────────────┤
│  Infrastructure            │  ← Postgres, Fuji RPC, Vercel/Railway/Supabase
└───────────────────────────┘
```
Each layer only calls the layer directly below it. The backend never bypasses the contract layer to fabricate state; the frontend never bypasses the backend for anything requiring the view key or auditor key.

## 9. Dependency Graph

```
apps/web  ──depends on──► packages/contracts-sdk, packages/ui, packages/eerc-adapter
apps/api  ──depends on──► packages/contracts-sdk, packages/eerc-adapter, packages/db
contracts ──depends on──► Safe core contracts (external), eERC contracts (external)
```
`packages/eerc-adapter` isolates all direct eERC SDK calls behind an internal interface — see Section 10 — so upstream SDK changes touch one package, not the whole codebase.

## 10. Design Principles

1. **On-chain state is canonical.** The backend is a cache and a compute layer, never an alternate source of truth.
2. **No component holds more secret than it needs.** The Policy Service holds a scoped view key; only client-side audit reconstruction ever touches the full auditor key, and only ephemerally.
3. **Safe is extended, never forked.** All integration happens through Safe's existing module/guard extension points.
4. **Isolate volatile dependencies.** The eERC SDK is wrapped in an internal adapter package to contain the blast radius of upstream changes.
5. **Every rejection is explainable.** A failed policy check always produces a logged, encrypted reason — never a silent drop.
