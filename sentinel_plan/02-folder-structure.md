# File: 02-folder-structure.md

# Sentinel — Folder Structure

## 1. Monorepo Layout

```
sentinel/
├── apps/
│   ├── web/                  # Next.js 15 frontend (signer/admin/auditor dashboard)
│   └── api/                  # Fastify backend (policy, indexer, audit coordination)
├── packages/
│   ├── contracts-sdk/        # Typed ABIs + Viem clients, generated from contracts/
│   ├── eerc-adapter/         # Isolation layer around the eERC SDK
│   ├── ui/                   # Shared shadcn/ui components, design tokens
│   ├── db/                   # Prisma schema + client, shared by api
│   └── config/               # Shared TS/ESLint/Tailwind config
├── contracts/
│   ├── src/                  # Solidity sources
│   ├── test/                 # Hardhat tests
│   └── deploy/                # Deployment + verification scripts
├── architecture/             # This documentation set (00–12)
├── docs/                     # Product-facing docs (README, pitch, demo script)
├── scripts/                  # Cross-package dev/build/seed scripts
└── configs/                  # Deployment configs (Vercel, Railway, Supabase)
```

## 2. `apps/web` — Frontend

```
apps/web/
├── app/
│   ├── (auth)/                # Wallet-signature login
│   ├── (dashboard)/           # Signer home: proposals, balances
│   ├── (policy)/              # Admin: configure caps, allowlists
│   ├── (audit)/               # Auditor: share submission, decrypted history
│   └── layout.tsx
├── components/                 # App-specific components (imports packages/ui)
├── hooks/                      # Wagmi/TanStack Query hooks
├── stores/                     # Zustand stores (session, wizard state)
└── lib/                        # Zod schemas, API client, formatting helpers
```
**Why this structure:** route groups map 1:1 to Sentinel's three user roles (signer, admin, auditor), so permissions and layouts are scoped naturally rather than checked ad hoc inside shared pages.

## 3. `apps/api` — Backend

```
apps/api/
├── src/
│   ├── modules/
│   │   ├── policy/            # Decrypt (view key) + evaluate proposals
│   │   ├── indexer/            # Chain event listener → Postgres mirror
│   │   └── audit/               # Shamir share intake, session-scoped reconstruction
│   ├── routes/                  # Fastify route definitions (see 05-api.md)
│   ├── plugins/                 # Auth, rate limiting, error handling
│   └── server.ts
└── prisma/ -> symlink to packages/db/prisma
```
**Why this structure:** each module owns exactly one of Sentinel's three capabilities, matching the responsibilities defined in `01-system-architecture.md`. No module reaches into another's internals directly — they communicate through the database or chain events only.

## 4. `packages/contracts-sdk`

Generated typed ABIs, addresses per network, and pre-configured Viem clients. Consumed identically by `apps/web` and `apps/api` so contract interfaces never drift between frontend and backend.

## 5. `packages/eerc-adapter`

**Why it exists:** the eERC SDK is the most volatile external dependency in the stack. Every call into it (encrypt, decrypt, registration check, proof generation) is wrapped here behind a stable internal interface, so an upstream SDK change is a one-package fix, not a codebase-wide one.

## 6. `packages/ui`

Shared shadcn/ui-based components and Tailwind design tokens (see `10-design-system.md`). Ensures the signer dashboard, policy config screens, and audit viewer share one visual language.

## 7. `packages/db`

Single Prisma schema, single PostgreSQL instance (see `04-database.md`). Owned exclusively by `apps/api`; the frontend never queries it directly.

## 8. `contracts/`

```
contracts/
├── src/
│   ├── SentinelModule.sol
│   ├── PolicyEngine.sol
│   ├── TreasuryManager.sol
│   └── AuditRegistry.sol
├── test/
└── deploy/
```
Kept outside `packages/` since it is compiled by Hardhat, not the TS build pipeline, and has its own dependency lifecycle (see `06-smart-contracts.md`).

## 9. `architecture/`, `docs/`, `scripts/`, `configs/`

- `architecture/` — this 12-file documentation set, the source of truth for implementation.
- `docs/` — product-facing material: README, pitch deck reference, demo script.
- `scripts/` — cross-package dev tooling (seed data, local chain bootstrap).
- `configs/` — deployment configuration for Vercel (web), Railway (api), Supabase (db), kept out of individual app folders so environment differences don't leak into app code.

## 10. Why a Monorepo

A single repo keeps `contracts-sdk` (the contract interface contract between frontend and backend) always in sync with the deployed contracts, and lets `eerc-adapter` be shared without a private package registry — both important given the small team size and short build window.
