# File: 03-user-flow.md

# Sentinel — User Flows

## 1. Treasury Creation / Module Setup

```
Admin connects wallet (must be existing Safe signer)
        │
        ▼
Selects existing Safe → enables SentinelModule (standard Safe module install tx)
        │
        ▼
Treasury funds converted to eERC (converter mode)
        │
        ▼
Admin configures initial policy: amount cap, counterparty allowlist
        │
        ▼
Admin designates 3 auditor key-holders (finance lead, auditor, governance rep)
        │
        ▼
Auditor key generated → Shamir-split 2-of-3 → shares distributed off-chain
        │
        ▼
Setup complete — Safe operates normally, Sentinel now intercepting proposals
```
**Edge case:** if fewer than 3 distinct addresses are available for key-holder roles, setup is blocked with an explicit error — a 2-of-3 scheme requires 3 independent holders.

## 2. Wallet Connection

```
User clicks "Connect Wallet" → Wagmi connector modal
        │
        ▼
Signature requested (SIWE-style message) → backend issues session
        │
        ▼
Backend checks: is this address a Safe signer / admin / auditor key-holder?
        │
        ▼
Role-scoped dashboard rendered (signer view / admin view / audit view)
```
**Edge case:** address recognized on-chain as a Safe owner but not yet eERC-registered → user is routed to a registration prompt before proposal actions are enabled.

## 3. Payment Proposal

```
Signer clicks "New Transaction" (standard Safe UI entry point)
        │
        ▼
Enters recipient + amount
        │
        ▼
Frontend checks recipient eERC-registration status
   ├─ not registered → warn: will settle as public ERC-20 fallback
   └─ registered → proceed encrypted
        │
        ▼
Amount encrypted client-side (ElGamal) + ZK proof generated
        │
        ▼
SentinelModule.proposeTransfer() submitted → TransferProposed event emitted
        │
        ▼
Proposal enters "pending policy check" state (invisible wait to signer)
```

## 4. Policy Validation

```
Backend Policy Service picks up TransferProposed event
        │
        ▼
Decrypts amount using scoped view key (not the full auditor key)
        │
        ▼
Evaluates against on-chain PolicyEngine rules (cap, allowlist)
        │
   ┌────┴────┐
   ▼         ▼
 PASS       FAIL
   │         │
   │         ▼
   │    AuditRegistry logs encrypted reason code
   │    Proposal marked "blocked" — never enters signer approval queue
   ▼
Proposal marked "approved for signing"
```

## 5. Approval Flow

```
Approved proposal appears in signers' Safe queue (native Safe UI)
        │
        ▼
Signers approve via standard N-of-M signature flow — unmodified
        │
        ▼
Threshold reached → transaction ready for execution
```
**Edge case:** if policy rules change between proposal and full signer approval, the proposal is re-evaluated at execution time; a newly-failing proposal is blocked even if previously passed.

## 6. Settlement (Batch)

```
Approved transfer joins pendingBatch[]
        │
        ▼
Batch trigger: N minutes elapsed OR K approvals reached (first wins)
        │
        ▼
executeBatch() — single on-chain tx settles all queued transfers
        │
        ▼
Public sees: "N transfers settled" — no amount, no 1:1 mapping to proposals
```

## 7. Audit Flow

```
Audit requested (scheduled or ad hoc)
        │
        ▼
2 of 3 key-holders independently submit their Shamir share (client-side only)
        │
        ▼
Key reconstructed in-browser (ephemeral, never transmitted or persisted)
        │
        ▼
Dashboard calls eERC SDK decrypt() with reconstructed key
        │
        ▼
Full history rendered: settled transfers + rejected transfers + reasons
```
**Edge case:** only 1 share submitted → reconstruction fails by design; dashboard shows "insufficient shares" with no partial decryption possible.

## 8. Key Reconstruction (Detail)

```
Holder A submits share → held in local session memory only
Holder B submits share → held in local session memory only
        │
        ▼
ShamirCombine(share_A, share_B) executes client-side
        │
        ▼
Reconstructed key used once for decrypt(), then discarded from memory
```
This flow is intentionally never proxied through the backend — see `11-security.md` for the trust boundary rationale.

## 9. Rejected Transactions

```
Proposal fails policy check
        │
        ▼
Encrypted reason code written to AuditRegistry
        │
        ▼
Signer sees: proposal never appears in their approval queue (no partial info leaked)
        │
        ▼
Auditor (post key-reconstruction) sees: full plaintext reason (e.g. "exceeds cap", "unapproved counterparty")
```
**Design decision:** signers are never shown *why* a proposal disappeared, to avoid leaking policy internals to a party who might route around them. Only reconstructed audit access reveals rejection reasons.

## 10. Error Handling (Cross-Cutting)

| Scenario | Handling |
|---|---|
| Recipient not eERC-registered | Frontend warns before submission; fallback to public ERC-20 transfer if user proceeds. |
| Policy Service unreachable | Proposal stays in "pending check" state; retried with backoff; never auto-approved as a fail-open default. |
| Batch trigger conditions never met (e.g. low activity) | Time-based trigger guarantees an upper bound on settlement latency. |
| Fewer than 2 shares available for audit | Reconstruction blocked; dashboard shows a clear insufficient-shares state, not an error stack trace. |
| Chain RPC failure during proposal submission | Frontend surfaces a retryable error state; no silent partial submission. |
