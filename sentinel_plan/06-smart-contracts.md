# File: 06-smart-contracts.md

# Sentinel — Smart Contract Architecture

## 1. Purpose & Scope

This document specifies every on-chain contract in Sentinel: its responsibility, storage, interfaces, events, errors, security posture, and how it interacts with Safe and eERC. No Solidity is written here — this is the specification an engineer implements against.

Sentinel is deliberately **not** a new wallet and **not** a fork of eERC. It is a thin coordination layer that:

1. Extends an existing Safe via Safe's own **module** extension point.
2. Calls the existing, audited **eERC** contracts for encryption/registration primitives rather than reimplementing cryptography.
3. Adds its own **policy** and **audit-registry** state, which is genuinely new logic specific to Sentinel.

## 2. Contract Inventory

| Contract | Role | Novel logic? |
|---|---|---|
| `SentinelModule` | Safe module entry point; the only contract Safe directly calls into | Thin orchestration, mostly novel |
| `PolicyEngine` | Stores and evaluates spend policy rules | Novel |
| `TreasuryManager` | Tracks Sentinel's view of treasury state (registration status, batch queue, settlement bookkeeping) | Novel |
| `AuditRegistry` | Append-only log of proposals, policy decisions, settlements, and audit events, referenced by the dashboard | Novel |
| `IeERCAdapter` (interface) | Thin interface wrapping calls into the existing eERC converter contracts | Adapter only, no new cryptography |
| `PolicyLib` | Library of pure policy-evaluation helper functions shared by `PolicyEngine` | Novel, pure functions |
| `Errors` | Shared custom error definitions | N/A |
| `Events` | Shared event definitions (imported by other contracts for consistent indexing) | N/A |

## 3. Contract Responsibilities

### 3.1 `SentinelModule`

**Role:** The single point of contact between Safe and Sentinel. Registered on the Safe as a module using Safe's standard `enableModule` flow — no fork of Safe, no custom Safe deployment.

**Responsibilities:**
- Receives `proposeTransfer` calls from an authenticated signer (msg.sender must be an owner of the linked Safe — checked via `Safe.isOwner()`).
- Forwards the encrypted amount + ZK proof to the `IeERCAdapter` for validity verification (proof that the sender has sufficient encrypted balance) — Sentinel does not reimplement Groth16 verification, it calls eERC's existing verifier.
- Calls `PolicyEngine.evaluate()` with the decrypted-by-view-key amount (decryption happens off-chain by the Policy-Check service, which then submits the plaintext-for-policy-purposes-only amount back on-chain as part of the check transaction, alongside a proof binding it to the original ciphertext — see §5.2 for the binding mechanism).
- On policy pass, calls `Safe.execTransactionFromModule()` conceptually is *not* used directly for the transfer itself — instead, the transfer is queued into `TreasuryManager`'s batch, and only the *batch settlement* is executed via the module against the Safe. This is deliberate: individual approvals still go through Safe's native N-of-M owner signature flow before a proposal is eligible for batching at all. `SentinelModule` never bypasses Safe's signature requirement.
- On policy fail, calls `AuditRegistry.logRejection()` and halts — the proposal never reaches Safe's approval queue.

**Explicitly does not:**
- Hold funds.
- Hold or use any private key.
- Bypass Safe's N-of-M requirement under any code path.

### 3.2 `PolicyEngine`

**Role:** Source of truth for spend policy rules and the pass/fail decision for a given proposal.

**Responsibilities:**
- Stores rule set: amount caps (global and optionally per-counterparty), counterparty allowlist/denylist entries.
- `evaluate(proposalId, revealedAmount, bindingProof, recipient) → (pass: bool, reasonCode)`. Pure/view-adjacent logic — no state mutation beyond logging.
- Rule changes are role-gated (only addresses holding the `finance_lead` role on-chain, mirrored from the off-chain role table via a role-sync call — see §6) and every change emits an event for the off-chain indexer.
- Rules are versioned: each rule has an `effectiveFrom` and is never deleted, only superseded, so historical proposals can always be re-evaluated against the rule that was live at proposal time — important for audit integrity.

**Explicitly does not:**
- Decrypt anything itself. It only ever receives a plaintext value *already decrypted off-chain* along with a cryptographic binding proof that the plaintext corresponds to the original ciphertext commitment. This keeps the on-chain contract free of any decryption-key material.

### 3.3 `TreasuryManager`

**Role:** Sentinel's on-chain bookkeeping of treasury state and the settlement batch queue.

**Responsibilities:**
- Tracks the linked Safe address and its eERC registration status.
- Maintains `pendingBatch[]` — an array of policy-approved, Safe-signed proposal IDs awaiting settlement.
- Enforces the batch trigger condition: settle when `block.timestamp >= lastSettlement + batchWindow` OR `pendingBatch.length >= batchSizeThreshold`, whichever comes first.
- `executeBatch()` calls `IeERCAdapter` once per settlement, submitting all queued encrypted transfers as a single transaction, then clears the queue and calls `AuditRegistry.logSettlement()`.
- Exposes `getTreasurySummary()` as a view function for the frontend/indexer to read registration + batch state without needing to decrypt anything.

### 3.4 `AuditRegistry`

**Role:** Append-only event log purpose-built for audit reconstruction. This is intentionally the "boring," conservative contract — its only job is to emit rich, well-structured events; almost no branching logic.

**Responsibilities:**
- `logProposal`, `logApproval`, `logRejection`, `logSettlement` — each emits a structured event with a proposal/batch ID, timestamp, and (for rejections) a reason code, but never a plaintext amount.
- Does **not** store the auditor key or any share — it stores only a `keyCommitment` hash used by the frontend to verify that a client-reconstructed key matches the one originally set up (so the dashboard can confirm "you reconstructed the *correct* key" without the contract ever seeing the key).
- Provides `getEventsInRange(fromBlock, toBlock)` as a convenience view, though in practice the indexer worker (see `01-system-architecture.md`) is the primary read path for the dashboard, with this function serving as a trust-minimized fallback / verification path.

### 3.5 `IeERCAdapter`

**Role:** Interface-only contract isolating every call Sentinel makes into eERC's converter-mode contracts, so that if eERC's interface changes or Sentinel later needs to support a second privacy primitive, only this adapter changes.

**Responsibilities:**
- `verifyProof(ciphertext, proof) → bool` — wraps eERC's Groth16 verifier.
- `submitEncryptedTransfer(recipient, ciphertext, proof)` — wraps eERC's transfer submission.
- `getEncryptedBalance(account) → bytes` — wraps eERC's balance read.
- `isRegistered(account) → bool` — wraps eERC's registration check.

**Explicitly does not:** implement any cryptographic primitive itself. This is a pass-through, kept intentionally minimal so the audited eERC contracts remain the single source of cryptographic truth.

### 3.6 `PolicyLib`

Pure-function library: cap comparison, allowlist membership check, reason-code construction. Kept as a library (not inlined into `PolicyEngine`) so it can be unit-tested in isolation and reused if a second policy contract (e.g., a future ZK-range-proof-based private-threshold checker per the pitch's "harder future work" note) is added later without duplicating logic.

## 4. Storage Layout (Conceptual)

### `PolicyEngine`
| Field | Type | Notes |
|---|---|---|
| `rules` | `mapping(bytes32 ruleId => Rule)` | `Rule { uint256 cap; address[] allowlist; uint64 effectiveFrom; bool active; }` |
| `orgRoleRegistry` | `mapping(address => Role)` | Mirrored from off-chain, see §6 |
| `ruleHistory` | `mapping(bytes32 ruleId => bytes32[] supersededBy)` | Append-only chain of rule versions |

### `TreasuryManager`
| Field | Type | Notes |
|---|---|---|
| `linkedSafe` | `address` | Immutable after setup |
| `pendingBatch` | `bytes32[]` | Proposal IDs |
| `batchWindow` | `uint64` | Seconds |
| `batchSizeThreshold` | `uint16` | |
| `lastSettlement` | `uint64` | Timestamp |
| `registered` | `bool` | eERC registration status cache |

### `AuditRegistry`
| Field | Type | Notes |
|---|---|---|
| `keyCommitment` | `bytes32` | Hash of the auditor public key, set once at setup |
| `eventCount` | `uint256` | Monotonic counter, used as a cheap integrity check against the off-chain indexer |

Note: `AuditRegistry` deliberately stores **no** transaction-level mapping in contract storage beyond what's needed for `getEventsInRange` — the rich queryable history lives in Postgres, fed by indexed events, per the read/write-plane separation in `01-system-architecture.md`.

## 5. Interfaces & Interaction Patterns

### 5.1 Safe Module Registration

Sentinel does not deploy a custom Safe. It targets an **existing** Safe and is enabled the standard way:

```
Safe.enableModule(SentinelModule.address)
```

This is a one-time, N-of-M-signed Safe transaction, identical in mechanism to enabling any other Safe module (e.g., a spending-limit module). No new trust assumption is introduced beyond "the Safe owners chose to enable this module," which mirrors how every other Safe module in the ecosystem is adopted.

### 5.2 Plaintext-Binding Proof (Policy Evaluation)

Because `PolicyEngine` needs a plaintext amount to compare against a cap, but the amount is only available encrypted on-chain, the off-chain Policy-Check service:

1. Decrypts the proposed amount using its scoped **view key** (narrower than the full auditor key — the view key can decrypt amounts for policy purposes only, it cannot decrypt historical balances or reconstruct the audit trail).
2. Produces a proof binding the revealed plaintext to the original ElGamal ciphertext commitment already posted on-chain (a standard "proof of plaintext knowledge" construction compatible with eERC's existing commitment scheme).
3. Submits `(revealedAmount, bindingProof)` in the same transaction that calls `PolicyEngine.evaluate()`.
4. The contract verifies the binding proof before trusting `revealedAmount` for the comparison — it never trusts a plaintext value that isn't cryptographically tied to the on-chain ciphertext.

This is the mechanism that lets a *public* policy threshold (§4.2 of the pitch) be checked honestly on-chain without the contract needing the full decryption key.

### 5.3 Batch Settlement Call Pattern

```
TreasuryManager.executeBatch()
  → for each proposalId in pendingBatch:
      IeERCAdapter.submitEncryptedTransfer(recipient, ciphertext, proof)
  → AuditRegistry.logSettlement(batchId, proposalIds, block.timestamp)
  → clear pendingBatch
```

Single transaction, single block, so an outside observer sees one settlement event covering N transfers without a trivial on-chain mapping from proposal to settled transfer.

## 6. Role Synchronization

Roles (`finance_lead`, `auditor`, `governance_rep`) are managed primarily in Postgres for UX reasons (fast reads, easy invite/removal flows), but `PolicyEngine` needs an on-chain source of truth for who may change policy rules, since UX-layer roles alone are not trust-minimized.

- **Sync mechanism:** role changes made through the API (`PATCH /organizations/:orgId/members/:userId`) that affect `finance_lead` status trigger a Safe transaction (N-of-M signed, same as any other sensitive Safe action) calling `PolicyEngine.setRole(address, Role)`.
- This means changing who can edit policy is itself gated by the Safe's existing multisig — the API can *propose* a role change, but cannot unilaterally grant on-chain policy-editing power.

## 7. Events

All events are defined centrally in `Events.sol` and imported, so the off-chain indexer has one canonical ABI to watch.

| Event | Emitted by | Fields |
|---|---|---|
| `TransferProposed` | `SentinelModule` | `proposalId, proposer, recipient, commitmentHash, timestamp` |
| `PolicyChecked` | `PolicyEngine` | `proposalId, passed, reasonCode, ruleId` |
| `TransferApproved` | `SentinelModule` | `proposalId, approvedAtSafeTxHash` |
| `TransferRejected` | `AuditRegistry` | `proposalId, reasonCode, timestamp` |
| `BatchQueued` | `TreasuryManager` | `proposalId, batchEpoch` |
| `BatchSettled` | `TreasuryManager` | `batchId, proposalIds, settlementTxHash, timestamp` |
| `RuleCreated` / `RuleUpdated` / `RuleDeactivated` | `PolicyEngine` | `ruleId, effectiveFrom, actor` |
| `RoleChanged` | `PolicyEngine` | `account, oldRole, newRole, actor` |
| `AuditKeyCommitmentSet` | `AuditRegistry` | `keyCommitment, timestamp` (setup only, once) |

## 8. Custom Errors

Defined in `Errors.sol`, used instead of `require(string)` throughout for gas efficiency and precise off-chain error mapping:

| Error | Thrown when |
|---|---|
| `NotSafeOwner()` | Caller of `proposeTransfer` is not a registered owner of the linked Safe |
| `NotEERCRegistered(address account)` | Sender or recipient hasn't completed eERC registration |
| `InvalidProof()` | eERC proof verification fails |
| `InvalidBindingProof()` | Plaintext-to-ciphertext binding proof fails (§5.2) |
| `PolicyCapExceeded(bytes32 ruleId, uint256 cap)` | Amount exceeds configured cap |
| `CounterpartyNotAllowed(address recipient)` | Recipient not on allowlist (if allowlist mode active) |
| `NotFinanceLead()` | Caller lacks role to edit policy rules |
| `BatchNotReady()` | `executeBatch` called before window/threshold trigger conditions are met |
| `AlreadySettled(bytes32 batchId)` | Re-entrancy / replay guard on batch settlement |
| `ModuleNotEnabled()` | `SentinelModule` called before Safe has enabled it |

## 9. Security Considerations

- **Reentrancy:** `executeBatch()` follows checks-effects-interactions — `pendingBatch` is cleared and `lastSettlement` updated *before* external calls to `IeERCAdapter`, with a settlement-in-progress guard as defense in depth.
- **Replay protection:** every proposal ID is derived from `keccak256(sender, recipient, commitmentHash, nonce)` where `nonce` is a per-sender monotonic counter tracked in `TreasuryManager`, preventing resubmission of an identical proposal.
- **Front-running of policy changes:** rule updates take effect at a future `effectiveFrom` block/timestamp rather than immediately, so a policy change cannot be used to retroactively wave through a proposal that was already in flight — proposals are always evaluated against the rule live at their *own* proposal timestamp (§3.2).
- **View-key compromise blast radius:** the view key used for policy-check decryption is scoped and rotatable independently of the full auditor key. If compromised, it exposes amounts for policy evaluation only — not historical balances, not the ability to reconstruct full audit history. Rotation invalidates old view-key-bound binding proofs going forward without touching the Shamir-split auditor key at all.
- **Safe ownership changes:** if Safe owners change (added/removed), `SentinelModule`'s `isOwner()` check always reflects the Safe's *current* owner set live — there is no cached owner list in Sentinel that could drift out of sync.
- **No admin backdoor:** there is no privileged "admin" address anywhere in the contract set that can move funds, alter balances, or override policy outside of the Safe's own N-of-M flow and the role-sync mechanism in §6. This is a deliberate design constraint, not an oversight.
- **Upgrade path:** contracts are **not** proxy-upgradeable in the speedrun build (deliberate — smaller attack surface, easier to audit, appropriate for a testnet prototype per the pitch's honesty notes). Post-hackathon roadmap includes evaluating a UUPS proxy pattern with a timelocked, Safe-gated upgrade authority once a security review is complete.

## 10. Known Boundaries (Stated Honestly, Per Product Source of Truth)

Carried forward directly from the pitch's "Scope & Honesty Notes":

- Policy thresholds in this build are **public** contract values, checked via the plaintext-binding mechanism in §5.2. Fully **private** thresholds (checking `amount ≤ cap` without revealing either value) require a new ZK range-proof circuit — this is named future work, not implemented here.
- The Shamir-split auditor key is **threshold custody**, not true threshold *encryption* — the full key briefly exists in-memory on the reconstructing client's device during an audit reveal. This is a known, explicitly documented limitation, with native threshold encryption listed on the roadmap.
- Standard eERC still leaves deposit/withdrawal amounts visible at the system's edges (entry/exit from the encrypted system). Sentinel narrows exposure by keeping funds circulating within eERC and batching settlements, but does not claim to close this gap entirely.
