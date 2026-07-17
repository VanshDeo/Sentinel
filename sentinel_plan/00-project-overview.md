# File: 00-project-overview.md

# Sentinel — Project Overview

## 1. Vision

Sentinel exists to remove a false choice that every on-chain organization currently faces: **transparency or accountability, but not both.**

Today, a DAO or Web3 company that manages treasury funds on a public chain must pick one of two broken defaults. Either it runs a fully public Safe multisig — broadcasting salaries, deal sizes, and runway to competitors, vendors, and anyone with a block explorer — or it collapses to a single private key, trading transparency for a form of privacy that also removes any possibility of independent verification. Neither option gives an organization what it actually needs: **the ability to keep sensitive financial data confidential while still being provably honest to auditors, regulators, and its own stakeholders.**

Sentinel's vision is a treasury layer where:

- Every payment is checked against policy *before* it settles, not audited after the fact when the money is already gone.
- Transaction amounts and balances are cryptographically hidden from public view, while remaining fully verifiable on-chain.
- No single party — not even the treasury owner — can unilaterally conceal what happened, because audit access requires cooperation among multiple independent key-holders.
- None of this requires an organization to migrate away from the multisig infrastructure it already trusts and already uses.

The long-term vision is for Sentinel to become the default compliance and privacy layer that sits underneath Safe treasuries the way a firewall sits underneath a network — invisible during normal operation, decisive at the moment it matters.

## 2. Problem Statement

Three structural problems compound to create the current state of on-chain treasury management:

### 2.1 Radical, unwanted transparency
Safe (formerly Gnosis Safe) secures upward of $100B in assets across EVM chains and is the de facto standard treasury wallet for DAOs and on-chain businesses. Every balance, every transfer amount, every counterparty relationship on a standard Safe is permanently and trivially public. This exposes sensitive competitive and operational information — salary bands, vendor negotiations, runway, fundraising terms — to competitors, adversarial actors, and the general public, indefinitely.

### 2.2 The privacy/accountability trade-off
The naive fix — "just encrypt everything with a single key" — solves transparency by destroying accountability. If one person (or one key) can decrypt the entire treasury history, that person can also selectively hide misuse from everyone else, including co-founders, investors, and auditors. Privacy without a distributed trust model is just opacity with extra steps.

### 2.3 Compliance is retroactive, not preventative
Where compliance tooling exists in the Safe ecosystem today (spending-limit modules, sanctions-screening oracles), it either applies static, inflexible rules or screens counterparties without addressing amount visibility. Critically, **none of it prevents a bad transaction from settling** — violations are typically discovered during a later audit, after funds have already moved. There is no widely adopted mechanism that evaluates a proposed payment against organizational policy *before* signers are even asked to approve it.

Sentinel's core insight is that these three problems are solvable together, using primitives that already exist independently in the ecosystem (Safe's module architecture, Avalanche's eERC encrypted-token standard, and Shamir's Secret Sharing) — but that have not yet been combined into a single product.

## 3. Solution

Sentinel is a **module that plugs directly into an existing Safe multisig**. It does not introduce a new wallet, a new address, or a new signing flow. Signers continue to use the Safe interface they already know. Underneath that familiar surface, Sentinel adds three coordinated capabilities:

1. **Encrypted balances and transfers** — built on Avalanche's eERC standard, using Groth16 zero-knowledge proofs and ElGamal encryption so that transfer amounts and balances are hidden from public view while remaining verifiable on-chain.
2. **Automated pre-settlement policy enforcement** — every proposed payment is evaluated against organizational spend rules (amount caps, approved-counterparty lists) *before* it reaches the human signer approval stage. Violations are blocked and logged with a reason, before money moves and before signers even see the proposal.
3. **Split-custody auditor access** — the key required to decrypt full transaction history is split across multiple independent key-holders (for example: finance lead, independent auditor, governance representative) using Shamir's Secret Sharing with a 2-of-3 threshold, so that no single party can unilaterally reveal or permanently conceal treasury activity.

The result: a treasury where the public sees that activity is occurring, but not its content; where policy violations never reach a vote; and where a full, honest audit trail is always reconstructable by legitimate multi-party consensus.

## 4. Product Philosophy

Sentinel is built on four non-negotiable design principles:

1. **Zero migration friction.** Any capability that requires an organization to abandon its existing Safe, address, or signer set is out of scope. Adoption must be an *enablement*, not a *migration*.
2. **Privacy is not secrecy.** Every privacy mechanism Sentinel ships must have a corresponding accountability mechanism. Encrypted data must always be reconstructable by legitimate, distributed authority — never by nobody, and never by one unilateral party.
3. **Prevention over detection.** Wherever architecturally possible, policy is enforced *before* a transaction settles, not reported on after the fact. Detection-only compliance is treated as a fallback, not a goal.
4. **Honest scoping over overclaiming.** Sentinel's documentation and product surface must always distinguish between what is cryptographically solved today (e.g., public policy thresholds checked against plaintext amounts at proposal time) and what remains a harder open problem clearly placed on the roadmap (e.g., private policy thresholds requiring novel ZK range-proof circuits, or true threshold decryption where no full key ever materializes). This principle governs both the product and every document in this architecture set.

## 5. Core Features

| Feature | Description |
|---|---|
| Safe Module Integration | Installs as a standard Safe module using existing `checkTransaction` guard hooks and `execTransactionFromModule` extension points — no fork of Safe, no new wallet standard. |
| Encrypted Treasury Balances | Treasury funds are wrapped into eERC (converter mode) so balances are hidden on-chain while remaining backed 1:1 by an underlying ERC-20 (e.g., a stablecoin). |
| Encrypted Payments | Transfer amounts are encrypted via ElGamal and proven valid via Groth16 ZK proofs, so amounts are never exposed publicly. |
| Automated Policy Engine | Rule-based checker (amount caps, counterparty allowlists) evaluates every proposed transfer before it reaches signer approval. |
| Split-Custody Auditor Access | 2-of-3 Shamir Secret Sharing across designated key-holders; no single party can decrypt the full audit trail alone. |
| Compliance Workflows | Rejected transactions are logged with an encrypted reason code, visible to auditors but not to the public. |
| Audit Dashboard | Authenticated, multi-party-gated interface that reconstructs and renders the full decrypted transaction history, including blocked transactions and their rejection reasons. |
| Batch Settlement | Approved transfers are queued and settled together in a single on-chain transaction, obscuring the mapping between individual proposals and individual settled transfers. |

## 6. Target Users

Sentinel is built for organizations that already run a Safe multisig treasury and need privacy without sacrificing internal or external accountability:

- **DAOs and on-chain foundations** that want to stop broadcasting cash position and spending patterns to the public while retaining governance-level accountability.
- **Finance and operations teams inside crypto-native businesses** that need a real, defensible compliance trail without making sensitive figures publicly visible.
- **Auditors, investors, and governance stakeholders** who need the ability to independently verify treasury activity without extending unilateral trust to any single keyholder.

## 7. User Personas

### Persona 1: Priya, Finance Lead at a Web3 Foundation
Priya manages a $12M treasury across a 4-of-7 Safe. She is under pressure from the foundation's board to stop leaking vendor payment terms and contractor rates to competitors via public block explorers, but she also needs to preserve a credible audit trail for the foundation's annual financial review. She is one of Sentinel's designated auditor key-holders and is also the person who configures spend policy.

### Persona 2: Marcus, Independent Auditor
Marcus is engaged quarterly by three different DAOs to review treasury activity. He does not want, and should not have, standing unilateral access to decrypt any of these treasuries at will. He holds one Shamir share for each engagement and only participates in key reconstruction during a scheduled audit window, alongside at least one other designated key-holder.

### Persona 3: Elena, Governance Representative
Elena is elected by token-holder vote to represent community interests in treasury oversight. She does not manage day-to-day payments but holds an auditor key share specifically so that community-facing audits cannot be blocked or manipulated by the finance team acting alone.

### Persona 4: Devon, Safe Signer
Devon is one of the DAO's transaction signers. Devon's day-to-day experience should not meaningfully change after Sentinel is installed — Devon still proposes and approves transactions inside the familiar Safe interface. Devon should not need to understand ZK proofs, ElGamal encryption, or Shamir's Secret Sharing to use the product correctly.

## 8. Goals

- Ship a working eERC-based encrypted treasury module deployed on Avalanche Fuji.
- Implement a rule-based, pre-settlement policy engine covering amount caps and counterparty allowlists.
- Implement 2-of-3 split-custody auditor key generation, distribution, and client-side reconstruction.
- Deliver a functional audit dashboard capable of rendering a full decrypted transaction history, including rejected transactions and their reasons.
- Deliver batch settlement that obscures the mapping between individual proposals and individual settled transfers to an outside observer.
- Preserve the native Safe N-of-M signing experience without modification for existing signers.

## 9. Non-Goals

The following are explicitly out of scope for the current architecture and must not be silently implemented as a substitute for the real goals above:

- **Private policy thresholds.** Checking `amount ≤ cap` without revealing either value requires a novel ZK range-proof circuit. This is not part of the current build; the current policy engine checks plaintext amounts against public on-chain thresholds at proposal time.
- **True threshold decryption.** The current auditor key model is threshold *custody* (Shamir's Secret Sharing), not threshold *encryption*. At the moment of reconstruction, a full key briefly exists on the reconstructing device. Schemes where a key never fully materializes anywhere (e.g., the 7-of-9 model referenced in ecosystem prior art) are a future direction, not a current claim.
- **New wallet standard or migration path.** Sentinel will never require an organization to abandon its existing Safe address or signer configuration.
- **Permissioned Avalanche L1 deployment.** This build targets Avalanche Fuji using standard eERC. Gating chain access via a permissioned L1 is a valid future direction but is not coupled to the current privacy thesis, which concerns what happens to a transaction *before* it settles.
- **AI/ML-based policy reasoning.** The policy engine is deterministic and rule-based. An architecture that could later support a reasoning-model-based policy layer is a stated design goal, but no such model is built, integrated, or claimed in the current scope.
- **Multi-chain or multi-multisig-platform support.** The current build targets Safe on Avalanche Fuji exclusively. Support for other multisig platforms is roadmap-only.
- **Real-fund production deployment.** This is a testnet prototype. No real treasury assets are handled, and a full third-party security review is a hard prerequisite before any mainnet deployment involving real funds.

## 10. MVP Scope

The MVP, scoped to the hackathon delivery window, must demonstrably complete the following end-to-end flow on Avalanche Fuji:

1. A Safe multisig has the Sentinel module enabled.
2. Treasury funds are converted into eERC (converter mode).
3. An organization admin configures a spend policy: an amount cap and a counterparty allowlist.
4. The auditor key is generated and split 2-of-3 across three designated addresses.
5. A signer proposes an encrypted transfer through the Safe interface.
6. The policy engine evaluates the proposal off-chain using a scoped view key and either:
   - Approves it, unlocking the normal Safe N-of-M signature flow, or
   - Rejects it, logging an encrypted reason code, before any signer sees it.
7. Approved transfers queue into a pending batch and settle together in a single batched transaction.
8. Two of the three auditor key-holders reconstruct the auditor key client-side and view the full decrypted transaction history — including rejected transactions and their reasons — in the audit dashboard.

Everything in this flow must be live and demoable. No portion of the MVP flow should be mocked, stubbed, or simulated in the final demo.

## 11. Future Scope

Ordered roughly by proximity on the roadmap (see `12-roadmap.md` for full detail):

- Full Safe module packaging for third-party installation outside the hackathon environment.
- Richer policy rules: time-based schedules, multi-tier approval limits, dynamic counterparty risk scoring.
- Independent security review of the policy-check contract and the eERC integration layer.
- Mainnet pilot with a real DAO or foundation treasury.
- Batching sized to real transaction volume to strengthen the anonymity set beyond what a low-volume testnet can demonstrate.
- Optional permissioned-L1 tier for organizations that additionally require access-gating, not just amount privacy.
- Migration from Shamir-split single-key custody toward true threshold encryption, where no full key ever materializes on any single device.
- SDK abstraction so the policy engine and audit layer can plug into multisig platforms beyond Safe.

## 12. Success Metrics

### Hackathon-phase metrics
- End-to-end demo flow (propose → check → approve/reject → batch settle → audit reveal) completes without manual intervention or mocked steps.
- Policy engine correctly blocks 100% of test transactions that violate configured rules, and correctly approves 100% of compliant test transactions.
- Auditor dashboard correctly reconstructs and renders full transaction history, including rejected transactions, using exactly 2 of 3 key shares — and correctly fails to reconstruct with only 1 share.
- All transfer amounts and treasury balances are confirmed unreadable on Snowtrace (Fuji block explorer) by direct inspection.

### Post-hackathon metrics (indicative, not commitments)
- Time from Safe module installation to first successful encrypted transfer (target: under 15 minutes for a technically competent finance lead).
- Number of DAOs/foundations completing a mainnet pilot.
- False-positive rate of the policy engine (compliant transactions incorrectly blocked) trending toward zero as rules mature.
- Median time from audit request to full reconstructed history rendered in-dashboard.

## 13. Risks

| Risk | Category | Mitigation Approach |
|---|---|---|
| eERC SDK immaturity or breaking changes during the build window | Technical | Pin SDK versions early; isolate eERC integration behind an internal adapter layer (see `01-system-architecture.md`) so upstream changes don't ripple through the whole codebase. |
| Registration friction (every signer/recipient must be eERC-registered before receiving private funds) | Product/UX | Build explicit onboarding flows and clear UI messaging; converter mode allows fallback to public ERC-20 for non-registered recipients. |
| Policy thresholds are public, which is a meaningfully weaker privacy guarantee than fully private thresholds | Product/Cryptographic | Documented explicitly as a known limitation, not hidden; clear roadmap item for ZK range-proof-based private thresholds. |
| Shamir-based key custody means a full key briefly exists on a reconstructing device at audit time | Security | Documented explicitly; reconstruction is a client-side, ephemeral, in-memory operation, never persisted or transmitted; true threshold encryption is roadmapped. |
| Low testnet transaction volume makes batching's anonymity-set benefit hard to demonstrate convincingly | Product | Explicitly framed as sized to the treasury's own volume rather than claiming a cross-user anonymity pool; honest framing in all product materials. |
| Safe module compatibility drift if Safe's core contracts change their guard/module interfaces | Technical | Target a specific, pinned Safe contract version; document upgrade path in `06-smart-contracts.md`. |
| Scope creep toward "solving" private thresholds or true threshold encryption within the hackathon window | Execution | Explicit non-goals section (this document) enforced across all downstream architecture and roadmap documents. |

## 14. Technical Constraints

- **Chain:** Avalanche Fuji testnet only for the current build. No mainnet deployment without a completed security review.
- **Privacy primitive:** Avalanche eERC in converter mode. Standalone (non-converter) eERC mode is out of scope, since the treasury must be able to fall back to a public underlying ERC-20 for non-registered recipients.
- **Multisig base:** Safe (formerly Gnosis Safe) exclusively. Sentinel extends Safe via its existing module and guard extension points; it does not fork or replace Safe's core contracts.
- **Cryptographic proof system:** Groth16 for ZK proofs, ElGamal for balance/amount encryption — as provided by the eERC standard. No custom proof systems are introduced in the current scope.
- **Key custody:** Shamir's Secret Sharing (2-of-3 threshold in the reference configuration) for auditor key distribution. Reconstruction happens client-side; shares are never submitted on-chain.
- **Policy evaluation:** Off-chain evaluation against on-chain public rule state, using a scoped view key narrower than the full auditor key. Policy logic itself is deterministic and rule-based, not model-based, in the current scope.
- **Frontend stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, TanStack Query, Zustand, React Hook Form, Zod — fixed for consistency across the engineering team (see `01-system-architecture.md` and `09-ui-architecture.md`).
- **Backend stack:** Fastify, Prisma, PostgreSQL — fixed for the policy-checker service, off-chain indexing, and audit-log persistence (see `05-api.md` and `04-database.md`).
- **Blockchain tooling:** Solidity, Hardhat, Viem, Wagmi — fixed for contract development and client-side chain interaction (see `06-smart-contracts.md` and `07-blockchain-architecture.md`).
- **Deployment targets:** Vercel (frontend), Railway (backend services), Supabase (managed Postgres, and/or auxiliary services) — fixed for the current build.
