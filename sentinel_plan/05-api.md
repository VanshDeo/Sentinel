# File: 05-api.md

# Sentinel — REST API Architecture

## 1. Purpose & Scope

The Sentinel API is the off-chain coordination layer that sits between the Next.js frontend, the Safe multisig, the eERC contracts on Avalanche Fuji, and PostgreSQL. It does not custody funds and it does not hold private keys. Its three jobs are:

1. **Policy evaluation** — decrypt proposed transfer amounts using the scoped view key and check them against on-chain/off-chain policy rules before a Safe signer ever sees the proposal.
2. **State indexing** — mirror on-chain events (proposals, approvals, rejections, settlements) into Postgres so the dashboard can query history without hammering an RPC node.
3. **Audit orchestration** — coordinate Shamir share submission, key reconstruction requests, and rendering of decrypted history, without ever persisting the reconstructed key server-side.

The API is a **read/coordination plane**, not a source of truth. The chain and the Safe are the source of truth for money movement; Postgres is a source of truth for UX-facing metadata (labels, reasons, audit logs, organization membership).

## 2. Design Principles

- **Never hold funds, never hold keys.** No private key, no auditor key, no Shamir share is ever written to the database or logged. Shares are transmitted client-side and combined client-side; the API only orchestrates *who* has submitted, not *what* they submitted.
- **Idempotent by design.** Every write endpoint that mirrors an on-chain event is idempotent on-chain-tx-hash + log-index, because indexers can replay.
- **Fail closed on policy checks.** If the policy engine cannot reach the chain, cannot decrypt, or cannot evaluate a rule for any reason, the transfer is rejected, not silently approved.
- **Every response has a stable shape.** All success responses share an envelope; all errors share an envelope. No endpoint returns a bare array.
- **Org-scoped by default.** Nearly every resource is scoped to an `organizationId` derived from the authenticated session, not from the URL, to prevent IDOR-style cross-org leakage.

## 3. Base Conventions

| Aspect | Convention |
|---|---|
| Base path | `/api/v1` |
| Format | JSON only, `application/json` |
| Casing | `camelCase` for all JSON fields |
| Timestamps | ISO-8601 UTC (`2026-07-17T09:15:00Z`) |
| IDs | UUIDv7 (time-sortable) for all internal entities; on-chain identifiers (addresses, tx hashes) kept as their native hex form |
| Amounts | Never returned in plaintext unless the caller is authorized and the value has been decrypted through an explicit audit flow. Encrypted amounts are returned as opaque ciphertext strings. |

### 3.1 Success Envelope

```
{
  "data": { ... } | [ ... ],
  "meta": { "requestId": "...", "timestamp": "..." }
}
```

### 3.2 Error Envelope

```
{
  "error": {
    "code": "POLICY_VIOLATION",
    "message": "Human-readable, safe to display",
    "details": { "ruleId": "...", "limit": "...", "actual": "..." },
    "requestId": "..."
  }
}
```

`requestId` is always present and correlates to server logs, so support/debugging never needs to ask "what did you send."

## 4. Authentication & Authorization

### 4.1 Authentication

- **Wallet-based auth (SIWE — Sign-In With Ethereum style).** The signer connects a wallet (via Wagmi/Viem on the frontend), requests a nonce, signs a structured message, and exchanges the signature for a session.
- Session is a short-lived JWT (15 min access token) plus a rotating refresh token stored as an HttpOnly, Secure, SameSite=Strict cookie. The access token is never stored in `localStorage`.
- Every request to a protected endpoint must present a valid access token; expired tokens are refreshed via `/auth/refresh` using the refresh cookie, not by re-signing.

### 4.2 Authorization Model

Authorization is **role-scoped within an organization**, not global:

| Role | Description | Can do |
|---|---|---|
| `signer` | A Safe owner/signer for the treasury | Propose transfers, view own org's proposal queue, approve within Safe (Safe handles the actual signature) |
| `finance_lead` | Configures policy, holds one auditor Shamir share | Everything a signer can do, plus edit policy rules, submit their audit share |
| `auditor` | External/independent reviewer, holds one auditor Shamir share | Read-only on all org transaction history once key is reconstructed; submit their audit share |
| `governance_rep` | Holds one auditor Shamir share, DAO governance representative | Same as auditor |
| `org_admin` | Manages org membership, module configuration | Everything above, plus invite/remove members, rotate roles |

Authorization is enforced via a Fastify `preHandler` hook that resolves `(userId, organizationId) → role`, and every route declares its minimum required role. There is no client-supplied role field anywhere in the request path — role is always looked up server-side.

### 4.3 On-Chain vs Off-Chain Authorization Boundary

The API can gate *visibility and orchestration*, but it cannot and does not gate *fund movement* — that authority stays entirely inside the Safe's native N-of-M signature scheme on-chain. This is a deliberate boundary: even a fully compromised Sentinel backend cannot move treasury funds, because it never has signing authority. The worst a compromised backend can do is show wrong data or fail to block a policy violation that a human might otherwise have caught — mitigated by "fail closed" (§2) and by the fact that Safe's own multisig approval is still required regardless of what Sentinel reports.

## 5. Endpoint Groups

### 5.1 Auth

| Method | Path | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/nonce` | Issue a one-time nonce for a wallet address to sign | Public |
| `POST` | `/auth/verify` | Verify SIWE signature, issue session | Public |
| `POST` | `/auth/refresh` | Rotate access token using refresh cookie | Refresh cookie |
| `POST` | `/auth/logout` | Revoke refresh token | Session |

### 5.2 Organizations & Treasuries

| Method | Path | Description | Min Role |
|---|---|---|---|
| `GET` | `/organizations/:orgId` | Org profile, linked Safe address, module status | signer |
| `POST` | `/organizations` | Register a new org around an existing Safe | org_admin (self-assigned on creation) |
| `GET` | `/organizations/:orgId/members` | List members and roles | signer |
| `POST` | `/organizations/:orgId/members` | Invite a member with a role | org_admin |
| `PATCH` | `/organizations/:orgId/members/:userId` | Change a member's role | org_admin |
| `DELETE` | `/organizations/:orgId/members/:userId` | Remove a member | org_admin |
| `GET` | `/organizations/:orgId/treasury` | Treasury summary: eERC registration status, encrypted balance ciphertext, module enablement state | signer |
| `POST` | `/organizations/:orgId/treasury/enable-module` | Record/confirm Sentinel module enablement on the Safe (mirrors an on-chain tx the frontend already submitted) | org_admin |

### 5.3 Policy

| Method | Path | Description | Min Role |
|---|---|---|---|
| `GET` | `/organizations/:orgId/policy` | Current active policy rule set | signer |
| `POST` | `/organizations/:orgId/policy/rules` | Create a rule (amount cap, counterparty allowlist entry) | finance_lead |
| `PATCH` | `/organizations/:orgId/policy/rules/:ruleId` | Update a rule | finance_lead |
| `DELETE` | `/organizations/:orgId/policy/rules/:ruleId` | Disable a rule (soft delete, kept for audit history) | finance_lead |
| `GET` | `/organizations/:orgId/policy/history` | Full change history of policy rules, who changed what and when | finance_lead |

### 5.4 Transfer Proposals

| Method | Path | Description | Min Role |
|---|---|---|---|
| `POST` | `/organizations/:orgId/proposals` | Register a new proposal (encrypted amount + proof already submitted on-chain; this call attaches metadata and triggers policy check) | signer |
| `GET` | `/organizations/:orgId/proposals` | List proposals, paginated, filterable by status | signer |
| `GET` | `/organizations/:orgId/proposals/:proposalId` | Single proposal detail, including policy check result and reason code if rejected | signer |
| `POST` | `/organizations/:orgId/proposals/:proposalId/recheck` | Force a re-evaluation against current policy (used if rules changed after initial check) | finance_lead |

### 5.5 Settlement / Batching

| Method | Path | Description | Min Role |
|---|---|---|---|
| `GET` | `/organizations/:orgId/batches` | List settlement batches, paginated | signer |
| `GET` | `/organizations/:orgId/batches/:batchId` | Batch detail: member proposal IDs, settlement tx hash, block time | signer |
| `POST` | `/organizations/:orgId/batches/trigger` | Manually trigger early batch settlement (if K-approvals threshold not yet met but N-minutes elapsed) | finance_lead |

### 5.6 Audit / Split-Key

| Method | Path | Description | Min Role |
|---|---|---|---|
| `POST` | `/organizations/:orgId/audit/requests` | Open a new audit request (reason, time range) | auditor |
| `GET` | `/organizations/:orgId/audit/requests/:requestId` | Audit request status: which shares submitted, threshold met? | auditor |
| `POST` | `/organizations/:orgId/audit/requests/:requestId/shares` | Submit acknowledgment that this holder has provided their share **client-side** (endpoint records *that* a share was submitted, never the share value itself) | finance_lead, auditor, governance_rep |
| `GET` | `/organizations/:orgId/audit/requests/:requestId/reveal` | Once threshold is met and reconstruction has happened client-side, this returns the decrypted ledger — decryption itself happens in-browser using the reconstructed key; this endpoint returns the ciphertext + metadata needed for the client to render it | auditor (after reconstruction) |
| `GET` | `/organizations/:orgId/audit/log` | Full audit trail of all system actions: proposals, rejections, rule changes, audit requests | finance_lead, auditor |

### 5.7 Events / Webhooks (internal)

| Method | Path | Description |
|---|---|---|
| `POST` | `/internal/events/chain` | Internal-only endpoint hit by the chain indexer worker to push new events into Postgres. Protected by a service-to-service secret, not exposed publicly. |

## 6. Validation

All request bodies are validated with **Zod schemas shared between frontend and backend** (in `packages/schemas`), so the same schema that drives React Hook Form validation drives Fastify route validation. This guarantees the client and server never disagree about what a valid payload looks like.

- Ethereum addresses validated as checksummed hex, 20 bytes.
- Ciphertext fields validated as well-formed hex of expected length for the eERC ElGamal scheme, not as arbitrary strings.
- Numeric policy values (caps) validated as positive integers in the token's smallest unit (no floats, ever, to avoid precision bugs).
- Every `PATCH`/`POST` body is validated with `.strict()` Zod schemas — unknown fields are rejected, not silently dropped, to catch client/server drift early.

## 7. Error Codes

| Code | HTTP Status | Meaning |
|---|---|---|
| `UNAUTHENTICATED` | 401 | No/expired session |
| `FORBIDDEN` | 403 | Authenticated but role insufficient |
| `NOT_FOUND` | 404 | Resource doesn't exist or isn't in caller's org |
| `VALIDATION_ERROR` | 422 | Body/query failed Zod validation, `details` includes field-level errors |
| `POLICY_VIOLATION` | 409 | Proposal rejected by policy engine; `details` includes ruleId, limit, actual (actual only if caller is authorized to see plaintext, else omitted) |
| `CHAIN_UNAVAILABLE` | 503 | RPC node unreachable, policy check could not run — proposal held in `pending_retry`, never silently approved |
| `DECRYPTION_FAILED` | 500 | View-key or reconstructed-key decryption failed — treated as a hard stop, never treated as "assume valid" |
| `THRESHOLD_NOT_MET` | 409 | Audit reveal requested before 2-of-3 shares submitted |
| `RATE_LIMITED` | 429 | Too many requests, see §8 |
| `CONFLICT` | 409 | Idempotency conflict (e.g., duplicate on-chain event replay with mismatched payload) |
| `INTERNAL_ERROR` | 500 | Unhandled; logged with `requestId` for correlation, generic message returned to client |

## 8. Rate Limiting

- Implemented via Fastify rate-limit plugin, backed by a Redis (or Railway-hosted equivalent) counter, not in-memory — so limits hold across horizontally scaled instances.
- **Per-session limits:** 120 requests/minute general, 10 requests/minute on `/proposals` (POST) and `/audit/requests/*/shares` specifically, since these are sensitive, low-frequency-by-nature actions.
- **Per-IP limits** as a secondary layer against unauthenticated endpoint abuse (`/auth/nonce`, `/auth/verify`): 20 requests/minute.
- Rate-limited responses include `Retry-After` header and the `RATE_LIMITED` error code.

## 9. Pagination

Cursor-based, not offset-based, since proposal/batch/audit-log tables grow continuously and offset pagination degrades and can skip/duplicate rows under concurrent writes.

```
GET /organizations/:orgId/proposals?limit=25&cursor=<opaque>
```

Response includes `meta.nextCursor: string | null`. Cursor encodes `(createdAt, id)` to remain stable under ties.

## 10. Versioning

- URL-based major versioning (`/api/v1`). Breaking changes ship as `/api/v2` with both versions live during a deprecation window (minimum 90 days), never a silent breaking change on `v1`.
- Additive, backward-compatible changes (new optional fields, new endpoints) ship without a version bump.
- Deprecated endpoints return a `Deprecation` and `Sunset` HTTP header ahead of removal.

## 11. What the API Deliberately Does Not Do

- It does not execute transfers. Execution is Safe's native multisig flow; the API only proposes metadata and evaluates policy.
- It does not store the auditor key or any Shamir share. Reconstruction happens entirely client-side in the browser.
- It does not serve plaintext transaction amounts to any role other than an authorized auditor mid-reveal, and even then only after the client has reconstructed the key itself.
- It does not act as a price oracle, KYC provider, or sanctions screener in this version — those are named as future integration points (see `12-roadmap.md`), not silently assumed.
