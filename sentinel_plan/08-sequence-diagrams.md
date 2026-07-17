# File: 08-sequence-diagrams.md

# Sentinel — Sequence Diagrams

## 1. Purpose of This Document

Where `07-blockchain-architecture.md` explains the *mechanics* of each lifecycle, this document lays out the exact *order of calls* between participants for every major flow, including failure branches. Participants are named consistently across all diagrams:

- **Signer** — human using `apps/web`
- **Web** — `apps/web` (Next.js frontend)
- **API** — `apps/api` (Fastify backend: Policy Service, Indexer Service, Audit Service)
- **Safe** — the unmodified Safe multisig contract + its native UI
- **SentinelModule / PolicyEngine / TreasuryManager / AuditRegistry** — Sentinel contracts (see `06-smart-contracts.md`)
- **eERC** — external eERC converter/registrar contracts
- **DB** — PostgreSQL, via Prisma (`packages/db`)

## 2. Wallet Connect

```
Signer          Web              Wagmi/Viem        Wallet Extension
  │               │                   │                    │
  │  Click Connect│                   │                    │
  │──────────────►│                   │                    │
  │               │  connect()         │                    │
  │               │──────────────────►│                    │
  │               │                   │  request accounts   │
  │               │                   │───────────────────►│
  │               │                   │                    │  user approves
  │               │                   │  address, chainId   │◄────┤
  │               │◄──────────────────│                    │
  │               │                   │                    │
  │               │  chainId !== 43113?                     │
  │               │──────┐                                  │
  │               │      │ if mismatch: switchChain request  │
  │               │◄─────┘                                  │
  │               │                   │  wallet_switchEthereumChain│
  │               │                   │───────────────────►│
  │  Connected, correct chain          │                    │
  │◄──────────────│                   │                    │
```

**Failure branch:** wallet extension not installed → Web shows connector options (WalletConnect QR) rather than a dead click. User rejects connection → Web returns to disconnected state, no retry loop auto-triggered.

## 3. Treasury Creation (Sentinel Module Setup)

```
Admin          Web            Safe UI         SentinelModule    eERC Registrar     TreasuryManager
  │             │                │                   │                 │                   │
  │ Enable       │                │                   │                 │                   │
  │ Sentinel     │                │                   │                 │                   │
  │─────────────►│                │                   │                 │                   │
  │              │ enableModule(SentinelModule)         │                 │                   │
  │              │───────────────►│                   │                 │                   │
  │              │                │  standard Safe N-of-M approval        │                   │
  │              │                │  (unchanged Safe flow)                 │                   │
  │              │◄───────────────│                   │                 │                   │
  │              │                │                   │                 │                   │
  │  Configure    │                │                   │                 │                   │
  │  spend policy │                │                   │                 │                   │
  │─────────────►│                │                   │                 │                   │
  │              │  setPolicy(cap, allowlist)             │                 │                   │
  │              │────────────────────────────────────►│                 │                   │
  │              │                │                   │  emits PolicySet │                   │
  │              │                │                   │                 │                   │
  │  Register each│                │                   │                 │                   │
  │  signer        │                │                   │                 │                   │
  │─────────────►│                │                   │                 │                   │
  │              │  registerUser(pubKey, proof) × N signers                │                   │
  │              │───────────────────────────────────────────────────────►│                   │
  │              │                │                   │                 │  RegisteredUser    │
  │              │                │                   │                 │                   │
  │  Wrap treasury│                │                   │                 │                   │
  │  funds to eERC│                │                   │                 │                   │
  │─────────────►│                │                   │                 │                   │
  │              │  deposit(amount) — via Safe execTransaction              │                   │
  │              │────────────────────────────────────────────────────────────────────────►│
  │              │                │                   │                 │  wrap complete     │
  │              │                │                   │                 │                   │
  │  Split auditor│                │                   │                 │                   │
  │  key (2-of-3) │                │                   │                 │                   │
  │─────────────►│                │                   │                 │                   │
  │              │  ShamirSplit(auditorSecret, 2, 3) — CLIENT-SIDE ONLY     │                   │
  │              │  distribute share[0..2] to designated holders             │                   │
  │              │  (out-of-band: never transmitted through API/DB)          │                   │
```

**Key architectural note:** Shamir splitting happens entirely client-side in the admin's browser during setup. Shares are handed to each holder through an out-of-band secure channel (documented in `11-security.md` §"Audit Key Security") — the API never sees a share, split or whole.

**Failure branch:** signer registration fails (e.g., proof generation error) → setup wizard halts on that step, remaining signers unaffected, admin can retry per-signer without restarting the whole flow.

## 4. Transfer Proposal

```
Signer         Web          eerc-adapter     SentinelModule    API (Policy Svc)
  │              │                │                  │                 │
  │ Fill form:    │                │                  │                 │
  │ recipient,     │                │                  │                 │
  │ amount         │                │                  │                 │
  │──────────────►│                │                  │                 │
  │              │  is recipient registered?             │                 │
  │              │──────────────────────────────────────►│                 │
  │              │◄──────────────────────────────────────│                 │
  │              │  (Zod validation, client-side)          │                 │
  │              │                │                  │                 │
  │              │  generateProof(balance, key, amount)     │                 │
  │              │───────────────►│                  │                 │
  │              │◄───────────────│  proof + ciphertext│                 │
  │              │  (Groth16, WASM, in-browser)              │                 │
  │              │                │                  │                 │
  │              │  proposeTransfer(recipient, encAmount, proof)             │
  │              │───────────────────────────────────────►│                 │
  │              │                │                  │  verify proof     │
  │              │                │                  │  (on-chain, cheap) │
  │              │                │                  │  emit TransferProposed│
  │              │◄───────────────────────────────────────│                 │
  │  "Proposal     │                │                  │                 │
  │  submitted"    │                │                  │                 │
  │◄──────────────│                │                  │                 │
```

**Failure branch — invalid proof:** on-chain verifier rejects, transaction reverts, no state change, no `TransferProposed` event emitted. Web surfaces a generic "transaction failed" state with a retry option (never exposes revert internals to the signer — see `11-security.md`).

**Failure branch — recipient not eERC-registered:** caught client-side before proof generation is even attempted, saving the signer a wasted proving step.

## 5. Policy Check

```
Indexer Svc      DB           Policy Svc        PolicyEngine       AuditRegistry
   │              │                │                    │                  │
   │  watch        │                │                    │                  │
   │  TransferProposed│              │                    │                  │
   │◄─────────────────────────────────────────────────────────────────────  (event, from chain)
   │              │                │                    │                  │
   │  write Proposal│                │                    │                  │
   │  row (status:   │                │                    │                  │
   │  PENDING_CHECK)  │                │                    │                  │
   │─────────────►│                │                    │                  │
   │              │                │                    │                  │
   │              │  new PENDING_CHECK row triggers Policy Svc                │
   │              │─────────────────►│                    │                  │
   │              │                │  decrypt(encAmount, viewKey)             │
   │              │                │  (VIEW KEY — amount-only scope)          │
   │              │                │                    │                  │
   │              │                │  getPublicRules(id) │                  │
   │              │                │───────────────────►│                  │
   │              │                │◄───────────────────│  cap, allowlist    │
   │              │                │                    │                  │
   │              │                │  compare plaintext amount vs cap;         │
   │              │                │  recipient vs allowlist                    │
   │              │                │                    │                  │
   ├─ PASS ───────┼────────────────┼───────────────────►│                  │
   │              │                │  submitCheckResult(id, true)             │
   │              │                │                    │  emit PolicyChecked│
   │              │  update Proposal│                    │  (true)          │
   │              │  status: APPROVED_FOR_SIGNING          │                  │
   │              │◄─────────────────────────────────────────────────────────│
   │              │                │                    │                  │
   ├─ FAIL ───────┼────────────────┼───────────────────────────────────────►│
   │              │                │  submitCheckResult(id, false, reasonCode)│
   │              │                │                    │  emit PolicyChecked│
   │              │                │                    │  (false, code)   │  writeRejection(id, encReason)
   │              │  update Proposal│                    │                  │
   │              │  status: REJECTED│                    │                  │
   │              │◄─────────────────────────────────────────────────────────│
```

**Failure branch — decryption fails (malformed ciphertext):** treated as a hard policy failure with a distinct reason code (`MALFORMED_CIPHERTEXT`), never silently passed through — a decrypt failure must never fail open.

## 6. Safe Approval (Unchanged Native Flow)

```
Signers (N)         Safe UI              Safe Contract
   │                    │                       │
   │  see APPROVED_FOR_SIGNING proposal            │
   │  in native Safe queue                          │
   │◄───────────────────│                       │
   │                    │                       │
   │  approve (sign)     │                       │
   │───────────────────►│                       │
   │  ... repeats for M-of-N required signers ...   │
   │                    │  execTransactionFromModule(...)│
   │                    │──────────────────────►│
   │                    │◄──────────────────────│  success
```

Sentinel does not appear in this diagram beyond having already flagged the proposal `APPROVED_FOR_SIGNING` — this is intentional: Safe's own approval mechanics are never modified, only gated beforehand (per `01-system-architecture.md` §2, and pitch §3 step 4).

## 7. Batch Settlement

```
TreasuryManager        Indexer Svc          DB              Web (all signers)
      │                     │                 │                    │
      │  approved transfer   │                 │                    │
      │  added to pendingBatch[]                │                    │
      │                     │                 │                    │
      │  ...time passes / more approvals accumulate...                │
      │                     │                 │                    │
      │  trigger: N min elapsed                │                    │
      │  OR K approvals reached                │                    │
      │  (whichever first)                     │                    │
      │──────┐              │                 │                    │
      │      │ executeBatch(pendingBatch)       │                    │
      │◄─────┘              │                 │                    │
      │  emit BatchSettled(batchId, count, block)│                    │
      │────────────────────►│                 │                    │
      │                     │  write Batch row  │                    │
      │                     │────────────────►│                    │
      │                     │                 │  poll/subscribe      │
      │                     │                 │◄──────────────────  │
      │                     │                 │                    │  "N transfers settled"
      │                     │                 │                    │  status update per signer
```

**Failure branch — double-trigger race:** if the time trigger and count trigger fire within the same block window, `executeBatch` is guarded by an on-chain "batch in flight" flag; the second call reverts as a no-op rather than double-settling (see `07-blockchain-architecture.md` §11).

## 8. Audit Flow (Key Reconstruction)

```
Holder A       Holder B        Web (Audit UI)      Audit Svc        AuditRegistry      eERC
   │              │                  │                  │                  │             │
   │  submit share │                  │                  │                  │             │
   │  (client-side  │                  │                  │                  │             │
   │  form field)   │                  │                  │                  │             │
   │──────────────────────────────────►│                  │                  │             │
   │              │  submit share       │                  │                  │             │
   │              │─────────────────────►│                  │                  │             │
   │              │                  │                  │                  │             │
   │              │                  │  ShamirCombine(shareA, shareB)          │             │
   │              │                  │  (CLIENT-SIDE, browser memory only)     │             │
   │              │                  │  ──► reconstructedKey                  │             │
   │              │                  │                  │                  │             │
   │              │                  │  fetchEncryptedLog(orgId)              │             │
   │              │                  │──────────────────►│                  │             │
   │              │                  │                  │  read commitment  │             │
   │              │                  │                  │  hashes + rejection│             │
   │              │                  │                  │  reasons            │             │
   │              │                  │                  │─────────────────►│             │
   │              │                  │◄──────────────────────────────────────│             │
   │              │                  │                  │                  │             │
   │              │                  │  eERC SDK decrypt(reconstructedKey, ciphertexts)      │
   │              │                  │────────────────────────────────────────────────────►│
   │              │                  │◄────────────────────────────────────────────────────│
   │              │                  │  render full transaction history        │             │
   │              │                  │  (including rejected txns + reasons)     │             │
   │              │                  │                  │                  │             │
   │              │                  │  reconstructedKey discarded on session end/navigate away│
```

**Critical trust-boundary note (stated exactly as in `07-blockchain-architecture.md` and the pitch's honesty section):** reconstruction happens entirely client-side. The Audit Service never receives shares or the reconstructed key — it only serves the encrypted log data that the browser then decrypts locally. This is threshold *key custody*, not threshold *encryption*: the full key briefly exists in the reconstructing browser's memory, which is a named, accepted limitation, not a hidden one.

**Failure branch — only 1 share submitted:** UI blocks the reconstruction attempt client-side with a clear "1 of 2 required shares provided" message; no partial-key state is ever computed or transmitted.

## 9. Failure Cases — Consolidated Reference

| Flow | Failure | System behavior |
|---|---|---|
| Wallet Connect | Wrong chain | Prompt `wallet_switchEthereumChain`, block writes until corrected |
| Wallet Connect | User rejects | Return to disconnected state, no auto-retry |
| Treasury Creation | Signer registration proof fails | Halt on that signer only, others unaffected |
| Transfer Proposal | Invalid ZK proof | On-chain revert, no event emitted, no partial state |
| Transfer Proposal | Recipient unregistered | Caught client-side pre-proof, no wasted proving |
| Policy Check | Ciphertext malformed | Hard fail, distinct reason code, never fails open |
| Policy Check | View key unavailable | Proposal stays `PENDING_CHECK`, alert raised (see `11-security.md`) |
| Safe Approval | Insufficient signatures | Standard Safe queue behavior, unchanged |
| Batch Settlement | Double-trigger race | On-chain in-flight guard, second call no-ops |
| Audit | Fewer than threshold shares | Blocked client-side, no partial computation |
| Audit | Reconstructed key incorrect (bad share) | eERC `decrypt()` fails cleanly, no garbage data rendered |

All failure states are designed to fail **closed** (block the risky action) rather than fail **open** (silently proceed) — this principle is restated and expanded in `11-security.md` §"Threat Model".
