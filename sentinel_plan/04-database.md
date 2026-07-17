# File: 04-database.md

# Sentinel — Database Architecture

PostgreSQL is an **off-chain mirror and query cache**, not the source of truth — on-chain contract state and events remain canonical (see `01-system-architecture.md`, Design Principle 1). This schema exists to make dashboard reads fast and to store data that should never live on-chain (session metadata, encrypted reason codes pre-decryption, key-holder assignments).

## 1. ER Diagram

```
Organization ──1:N──► SafeTreasury ──1:N──► Policy
      │                     │
      │                     ├──1:N──► Proposal ──1:1──► PolicyCheckResult
      │                     │              │
      │                     │              └──N:1──► BatchSettlement
      │                     │
      │                     └──1:N──► AuditorKeyShareHolder
      │
      └──1:N──► User ──N:N──► SafeTreasury (via SignerAssignment)
```

## 2. Tables

### `organization`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | |
| created_at | timestamptz | |

**Why it exists:** groups one or more Safe treasuries under a single org for multi-treasury organizations.

### `user`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| wallet_address | text UNIQUE | lowercase, checksummed on write |
| organization_id | uuid FK → organization | |
| created_at | timestamptz | |

**Why it exists:** links a wallet address to an org context; role is derived, not stored here (see `signer_assignment` and `auditor_key_share_holder`).

### `safe_treasury`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| organization_id | uuid FK → organization | |
| safe_address | text UNIQUE | on-chain Safe address |
| module_address | text | deployed SentinelModule instance |
| chain_id | int | Fuji = 43113 |
| eerc_token_address | text | wrapped token contract |
| created_at | timestamptz | |

### `signer_assignment`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK → user | |
| safe_treasury_id | uuid FK → safe_treasury | |
| role | enum(`signer`,`admin`) | |

**Why it exists:** many-to-many between users and treasuries — a person can be a signer on multiple Safes.

### `policy`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| safe_treasury_id | uuid FK → safe_treasury | |
| amount_cap | numeric | mirrors on-chain public cap |
| allowlist | text[] | approved counterparty addresses |
| active | boolean | |
| updated_at | timestamptz | |

**Why it exists:** fast read of current policy for UI display; on-chain `PolicyEngine` remains the enforced source of truth — this row is a cache, refreshed by the indexer on every `PolicyUpdated` event.

### `proposal`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| safe_treasury_id | uuid FK → safe_treasury | |
| onchain_id | text UNIQUE | matches `TransferProposed(id,...)` |
| recipient_address | text | |
| commitment_hash | text | from on-chain event, not plaintext amount |
| status | enum(`pending_check`,`approved`,`rejected`,`settled`) | |
| created_at | timestamptz | |

**Why no amount column:** the plaintext amount is never persisted in Postgres. Only the commitment hash is stored; decrypted amounts exist only transiently in the Policy Service during evaluation.

### `policy_check_result`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| proposal_id | uuid FK UNIQUE → proposal | |
| passed | boolean | |
| encrypted_reason_code | text | null if passed |
| checked_at | timestamptz | |

### `batch_settlement`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| safe_treasury_id | uuid FK → safe_treasury | |
| onchain_tx_hash | text UNIQUE | |
| proposal_count | int | |
| settled_at | timestamptz | |

### `proposal_batch_link`
| Column | Type | Notes |
|---|---|---|
| proposal_id | uuid FK → proposal | |
| batch_settlement_id | uuid FK → batch_settlement | |

**Why a join table:** many proposals settle in one batch — explicit many-to-one mapping kept off-chain for dashboard queries only; this mapping is never derivable by the public from chain data alone, by design.

### `auditor_key_share_holder`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| safe_treasury_id | uuid FK → safe_treasury | |
| user_id | uuid FK → user | |
| share_label | text | e.g. "finance_lead" — metadata only |
| assigned_at | timestamptz | |

**Critical constraint:** this table stores **who holds a share**, never the share value itself. Share material never touches the backend or database — see `11-security.md`.

### `audit_session`
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| safe_treasury_id | uuid FK → safe_treasury | |
| initiated_by | uuid FK → user | |
| status | enum(`awaiting_shares`,`reconstructed_client_side`,`expired`) | |
| created_at | timestamptz | |
| expires_at | timestamptz | |

**Why it exists:** tracks *that* an audit session occurred and its outcome state, without ever storing the reconstructed key or decrypted content server-side.

## 3. Relationships Summary

- `organization` 1:N `safe_treasury`
- `safe_treasury` 1:N `policy`, `proposal`, `batch_settlement`, `auditor_key_share_holder`
- `proposal` 1:1 `policy_check_result`
- `proposal` N:M `batch_settlement` via `proposal_batch_link`
- `user` N:M `safe_treasury` via `signer_assignment` and `auditor_key_share_holder`

## 4. Indexes

- `user(wallet_address)` — unique, used on every session auth check.
- `safe_treasury(safe_address)` — unique, primary lookup key from chain events.
- `proposal(onchain_id)` — unique, indexer upsert target.
- `proposal(safe_treasury_id, status)` — composite, powers dashboard "pending/approved" queue views.
- `batch_settlement(onchain_tx_hash)` — unique.

## 5. Constraints

- `signer_assignment(user_id, safe_treasury_id)` — unique composite, prevents duplicate role rows.
- `auditor_key_share_holder(safe_treasury_id, user_id)` — unique composite, one share role per user per treasury.
- `policy_check_result.proposal_id` — unique, exactly one check result per proposal.
- Foreign keys cascade on `organization`/`safe_treasury` delete only in non-production seed/reset scripts; production schema uses `ON DELETE RESTRICT` to prevent accidental audit-trail loss.

## 6. Prisma Model Planning

- One `schema.prisma` in `packages/db`, consumed only by `apps/api` (see `02-folder-structure.md`).
- Enums (`status`, `role`) defined natively in Prisma, mapped to Postgres enum types.
- No `amount` or plaintext-sensitive fields anywhere in the schema — enforced by code review checklist, not just convention (see `11-security.md`).
- Migrations tracked via Prisma Migrate; indexer service runs schema-safe upserts, never destructive writes to historical rows.

## 7. Audit Metadata

Audit-relevant metadata (who holds which share role, when an audit session was opened, whether it reached `reconstructed_client_side`) is fully tracked in Postgres for operational visibility. The *content* revealed by an audit (decrypted amounts, reasons) is never persisted server-side — it exists only in the requesting auditor's browser session for the duration of the audit.

## 8. User Roles (Recap)

| Role | Table | Scope |
|---|---|---|
| Signer | `signer_assignment` (role=`signer`) | Can propose/approve transactions via Safe. |
| Admin | `signer_assignment` (role=`admin`) | Can configure `policy` rows and treasury settings. |
| Auditor key-holder | `auditor_key_share_holder` | Can participate in key reconstruction; not a Safe signer role by default. |
