# File: 07-blockchain-architecture.md

# Sentinel — Blockchain Architecture

## 1. Purpose of This Document

`01-system-architecture.md` establishes that Sentinel is four cooperating layers, and `06-smart-contracts.md` (companion file) defines each contract's storage and interface. This document explains the **mechanics that connect them**: how eERC is actually wired in, how Viem and Wagmi talk to Fuji, what a transaction looks like end-to-end, and where zero-knowledge proofs and encryption enter and leave the picture. Every claim here matches the honesty boundaries stated in the pitch — nothing described below is invented capability.

## 2. Network Configuration

| Setting | Value |
|---|---|
| Network | Avalanche Fuji (C-Chain testnet) |
| Chain ID | 43113 |
| RPC | Public Fuji RPC (Ankr/Avalanche-hosted), configurable per environment via `packages/config` |
| Explorer | Snowtrace (Fuji) |
| eERC deployment | Converter mode, wrapping a test stablecoin (e.g., a Fuji-deployed mock USDC) |

Mainnet C-Chain is deliberately out of scope for the speedrun build (see `12-roadmap.md`); all addresses, ABIs, and deploy scripts are Fuji-only in this phase, with network config isolated in `packages/config` so a future mainnet cutover changes one file, not application code.

## 3. eERC Integration — How It Actually Works

### 3.1 Converter Mode, Not Standalone

Sentinel does not mint a new private token. It wraps an existing ERC-20 (the org's stablecoin of choice) through eERC's converter contracts. This is a deliberate product decision, not just a technical one: it means a treasury can always unwrap back to the public ERC-20 to pay a recipient who isn't eERC-registered, which is a real, frequent case (vendors, payroll to individuals, exchanges).

```
┌────────────────────┐        wrap (deposit)         ┌──────────────────────┐
│  Public ERC-20      │ ─────────────────────────────► │  eERC Converter       │
│  (e.g., mock USDC)   │                                │  (encrypted balance   │
│                      │ ◄───────────────────────────── │   ledger)             │
└────────────────────┘        unwrap (withdraw)        └──────────────────────┘
```

**Honest edge:** deposit and withdrawal amounts are visible on-chain at the moment of wrap/unwrap — this is a known eERC-level limitation, not something Sentinel hides. Sentinel narrows real-world exposure by keeping funds circulating inside the encrypted system and batching settlements (see §7), rather than claiming the edges are solved.

### 3.2 Registration — A Real Onboarding Step

Every signer and every recipient must be eERC-registered before they can send or receive privately. Registration publishes an ElGamal public key on-chain for that address. This is **not automatic** — it is a deliberate first step in the Treasury Creation flow (see `03-user-flow.md`, `08-sequence-diagrams.md` §2).

```
Address ──registerUser(pubKey, proof)──► eERC Registrar
                                              │
                                              ▼
                                   RegisteredUser(address, pubKey)
```

If a recipient is not registered, Sentinel's UI surfaces this before the signer submits the proposal (see `09-ui-architecture.md`), rather than allowing a proposal to fail on-chain.

### 3.3 What's Public vs. Private, Per Transfer

Restated here as the authoritative reference for engineering (source: pitch §4.1):

| On-chain, public | Private (encrypted / off-chain) |
|---|---|
| Sender & recipient addresses | Transfer amount |
| ZK proof of valid balance (Groth16) | Sender's remaining balance |
| Encrypted ciphertext blob (ElGamal) | Plaintext amount inside the ciphertext |
| Policy pass/fail flag + rule ID (if rejected) | The policy threshold itself, only if configured private (not in this build — see §6) |

## 4. Viem — Chain Communication Layer

Viem is the single low-level chain client used across the stack. It is never called directly from application code — it is wrapped once in `packages/contracts-sdk`.

```
packages/contracts-sdk/
├── clients/
│   ├── publicClient.ts     # read-only: chain reads, event logs, simulate
│   └── walletClient.ts     # write: only ever instantiated with a connected signer
├── abis/                    # generated from contracts/ build artifacts
└── addresses/
    └── fuji.ts               # deployed contract addresses, single source of truth
```

**Why this shape:**
- A single `publicClient` config means retry/backoff/RPC-fallback logic is written once.
- `walletClient` is never constructed with a private key server-side — write access always flows through a connected wallet (Wagmi on the frontend) or a narrowly-scoped operational key for the backend's own limited on-chain writes (policy pass/fail flag submission — see §6.2).
- ABIs are generated, not hand-written, so a contract change cannot silently drift from the SDK.

### 4.1 Read Path (Backend and Frontend)

```
apps/web or apps/api
      │
      ▼
contracts-sdk.publicClient.readContract({ address, abi, functionName, args })
      │
      ▼
Fuji RPC ──► contract storage read ──► typed return value
```

### 4.2 Write Path (Frontend, User-Initiated)

```
apps/web
   │
   ▼
Wagmi useWriteContract() ──► connected wallet (Core, MetaMask, WalletConnect)
   │
   ▼
User signs in wallet UI
   │
   ▼
contracts-sdk.walletClient.writeContract(...) ──► Fuji mempool ──► block inclusion
```

### 4.3 Write Path (Backend, System-Initiated)

Only one backend-initiated on-chain write exists in this build: submitting the policy pass/fail result to `PolicyEngine` after off-chain evaluation. This uses a dedicated operational wallet, scoped to that single function selector at the infrastructure level (see `11-security.md` §"Secrets Management"), never a treasury signer's key.

## 5. Wagmi — Wallet Connection Layer

Wagmi sits above Viem in `apps/web` only (the backend has no wallet UI). It owns connection state, account switching, and chain-guard logic.

```
┌───────────────────────────────────────────────────────────┐
│                     Wagmi Provider (apps/web)                │
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐ │
│  │ useAccount()   │  │ useConnect()   │  │ useWriteContract()│ │
│  └───────────────┘  └───────────────┘  └──────────────────┘ │
└───────────────────────┬───────────────────────────────────┘
                          │
                          ▼
                connectors: injected (Core/MetaMask), WalletConnect
```

Wagmi state (connected address, chain ID) is treated as **session-scoped local state**, owned by Zustand per `01-system-architecture.md` §3 — TanStack Query never caches wallet connection state, only chain-derived data fetched once connected.

### 5.1 Chain Guard

On every write attempt, a guard checks `chainId === 43113` before allowing the transaction to reach the wallet. If mismatched, Sentinel prompts a network switch via `wallet_switchEthereumChain` rather than allowing a doomed transaction to be signed.

## 6. Transaction Lifecycle — Full Path

This is the canonical lifecycle referenced by `08-sequence-diagrams.md` and `03-user-flow.md`. It has three distinct sub-lifecycles that compose: the **proof/encryption lifecycle** (§6.1), the **policy-check lifecycle** (§6.2), and the **Safe approval + settlement lifecycle** (§6.3).

```
 Signer fills           Encrypt +           Policy check       Safe N-of-M       Batch
 proposal form   ─────► generate proof ────► (off-chain,  ────► approval  ────► settlement
 (apps/web)             (eerc-adapter)       backend)           (Safe UI)        (on-chain)
```

### 6.1 zk Proof Lifecycle

Every eERC transfer requires a Groth16 proof that the sender's encrypted balance is sufficient, without revealing the balance.

```
1. Client (apps/web, via packages/eerc-adapter) gathers:
      - sender's current encrypted balance (read from chain)
      - sender's private decryption key (held client-side only, never transmitted)
      - proposed transfer amount (plaintext, known only to signer at this point)

2. Adapter constructs the witness and calls the eERC SDK's proof generator
   (WASM, runs in-browser) → produces a Groth16 proof + new ciphertexts

3. Proof + ciphertexts submitted as calldata to SentinelModule.proposeTransfer()

4. On-chain: eERC verifier contract checks the proof cheaply (pairing check)
   before any state change — invalid proof reverts, no partial state.
```

**Why proof generation happens client-side, not on the backend:** the sender's private key never leaves the browser. The backend only ever receives a proof and ciphertexts it can verify or use with a narrower view key — never the signer's private key. This boundary is load-bearing for the entire security model (see `11-security.md`).

### 6.2 Encryption / Policy-Check Lifecycle

```
proposeTransfer(recipient, encryptedAmount, proof)
   │
   ▼
emits TransferProposed(id, recipient, commitmentHash)
   │
   ▼
Indexer Service (apps/api) picks up event
   │
   ▼
Policy Service decrypts proposed amount using a VIEW KEY
  (scoped — can decrypt amounts only, not full balance history;
   distinct from the split auditor key in 06-smart-contracts.md §4)
   │
   ▼
checkPolicy(id): compare plaintext amount against on-chain public
  rule set (PolicyEngine) — cap and allowlist checks only, in this build
   │
   ├─ PASS ──► submit PolicyChecked(id, true) on-chain ──► unlocks Safe flow
   │
   └─ FAIL ──► submit PolicyChecked(id, false, reasonCode) on-chain
               ──► encrypted log entry in AuditRegistry, signers never see it
```

**Where the view key lives:** held only by the Policy Service's operational environment (see `11-security.md` §"Secrets Management"), never exposed to the frontend, never equal to the auditor key. This is the same "public thresholds" design decision documented in the pitch §4.2 — the cap itself is a public contract variable; only the proposed amount is decrypted for comparison.

### 6.3 Safe Approval + Settlement Lifecycle

```
PolicyChecked(id, true) observed by apps/web
   │
   ▼
Proposal appears in Safe's native transaction queue (unchanged Safe UX)
   │
   ▼
Signers approve via Safe's existing N-of-M flow — Sentinel does not
  intercept or alter Safe's signature collection at all
   │
   ▼
On full approval: transfer enters TreasuryManager.pendingBatch[]
  (does NOT execute immediately — see §7)
```

## 7. Batched Settlement — Chain Mechanics

```
pendingBatch[] accumulates approved transfers until:
   trigger = (N minutes elapsed) OR (K approvals reached) — whichever first
   │
   ▼
executeBatch(pendingBatch) — single transaction, many encrypted transfers
   │
   ▼
emits BatchSettled(batchId, count, blockNumber)
```

An outside observer of Snowtrace sees "N transfers settled in this block" but cannot map a specific `TransferProposed` event to a specific settled transfer without the Policy Service's view key or the reconstructed auditor key. The **unlinkability** here is a direct function of batch size — see `11-security.md` §"Blockchain Attack Vectors" for the honest treatment of small-batch deanonymization risk during the testnet phase.

## 8. Event Listener Architecture

The Indexer Service is the single place that listens to chain events; nothing else in the backend subscribes independently.

```
┌─────────────────────────────────────────────────────────────┐
│                     Indexer Service (apps/api)                 │
│                                                                 │
│  Viem publicClient.watchContractEvent({                        │
│    address: SentinelModule, eventName: 'TransferProposed', ...}) │
│                                                                 │
│  ┌────────────────┐  ┌───────────────────┐  ┌────────────────┐ │
│  │TransferProposed │  │  PolicyChecked     │  │  BatchSettled   │ │
│  └────────┬────────┘  └─────────┬──────────┘  └────────┬───────┘ │
│           ▼                     ▼                       ▼        │
│      write Proposal        update Proposal        write Batch    │
│      row (Postgres)        status (Postgres)       row (Postgres)│
└─────────────────────────────────────────────────────────────┘
```

**Reorg handling:** the indexer waits for a configurable confirmation depth (default: 2 blocks on Fuji) before marking an event's derived row "confirmed" in Postgres, and re-derives from chain state if a watched block is replaced. Postgres is explicitly a rebuildable cache (per `01-system-architecture.md` §4) — a full reindex from genesis block of deployment is always possible and is the documented recovery path for indexer corruption.

## 9. Contract Interaction Map

```
                     ┌─────────────────┐
                     │   Safe Multisig   │
                     │   (N-of-M, guard)  │
                     └────────┬──────────┘
                              │ guard hook
                              ▼
                     ┌─────────────────┐
          ┌──────────┤ SentinelModule   ├──────────┐
          │          └─────────────────┘          │
          ▼                                        ▼
┌─────────────────┐                    ┌─────────────────────┐
│  PolicyEngine     │                    │  TreasuryManager      │
│  (pass/fail rules) │                    │  (wrap/unwrap, batch)  │
└────────┬──────────┘                    └──────────┬───────────┘
          │                                          │
          ▼                                          ▼
┌─────────────────┐                    ┌─────────────────────┐
│  AuditRegistry     │                    │  eERC Converter        │
│  (commitment log)   │                    │  Contracts (external)  │
└────────────────────┘                    └─────────────────────┘
```

Full function-level interfaces for each contract are defined in `06-smart-contracts.md`; this diagram exists to make the call/dependency direction unambiguous before any contract is written.

## 10. Explorer Behavior — What Snowtrace Actually Shows

This is worth documenting explicitly because it is Sentinel's core external-facing privacy claim, and needs to match reality exactly:

| Snowtrace shows | Snowtrace does NOT show |
|---|---|
| That a `proposeTransfer` call happened, by whom, to whom | The transfer amount |
| That a batch settled, and how many transfers it contained | Which proposal maps to which settled transfer |
| Contract addresses, function selectors, gas used | Sender's or recipient's remaining balance |
| A `PolicyChecked` event with pass/fail and rule ID | The policy threshold value's relationship to the amount, if it were configured private (not in this build) |
| Raw ciphertext bytes (ElGamal blob) in calldata | Any plaintext derivable from that ciphertext without the relevant key |

Anyone can independently verify this by reading calldata for a Sentinel transaction on Snowtrace Fuji — the encrypted blob is visibly opaque bytes, not obfuscated-but-decodable data. This traceability of the *claim itself* is part of what a judge or auditor should be able to check without trusting Sentinel's word for it.

## 11. Assumptions and Edge Cases

- **RPC availability:** the build assumes a single public Fuji RPC endpoint is sufficient for the demo window; production would require RPC fallback/load balancing, listed as post-hackathon work in `12-roadmap.md`.
- **Gas sponsorship:** signers pay their own gas in this build (standard Safe behavior); a gas-sponsorship/paymaster layer is out of scope.
- **Proof generation performance:** in-browser Groth16 proving is CPU-bound and can take several seconds on lower-end devices; the UI must show explicit progress state during this step (see `09-ui-architecture.md` §"Loading States").
- **Unregistered recipient mid-flow:** if a recipient de-registers or was never registered, `proposeTransfer` must fail fast and legibly, not as a generic revert (see `11-security.md` §"Input Validation").
- **Batch trigger race:** if both the time trigger and the count trigger fire near-simultaneously, `executeBatch` must be idempotent/guarded against double-execution — a single on-chain lock flag, not a client-side race resolution.
