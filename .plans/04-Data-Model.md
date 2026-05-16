# Data Model — Phase 1

Database schema for the MVP. Designed to be relational (PostgreSQL) and extensible for Phase 2 features.

## Design principles

1. **`hoa_id` everywhere.** Even though Phase 1 ships single-tenant (one row in `hoas`), every domain table carries `hoa_id`. Adding it now is free; retrofitting tenant isolation across a live database is not. Treat `hoa_id` as a hard NOT NULL on every table that isn't itself the `hoas` row.
2. **Money lives in its own table.** `dues` describe what is owed; `payments` describe what was received; `due_payments` allocates one to the other. A payment may cover several dues, a due may be paid in parts, and Phase 2's Stripe integration drops in without schema churn.
3. **Residency is temporal.** A unit's resident changes over time. `unit_residents` captures the history so past dues stay tied to the right owner.
4. **Soft-delete by default** for users, units, and HOAs. Hard deletes break audit trails and dues history.

---

## Entity Overview

```
                ┌──────────┐
                │   Hoas   │ (one row in Phase 1)
                └────┬─────┘
                     │ owns everything below
                     ▼
┌──────────┐   ┌──────────┐         ┌──────────────┐
│  Users   │   │  Units   │         │ Announcements│
└────┬─────┘   └────┬─────┘         └──────┬───────┘
     │              │                       │
     │  unit_       │                       │ translations
     │  residents   │                       ▼
     │ (history)    │                ┌──────────────────────┐
     └──────┬───────┘                │ AnnouncementTrans... │
            │                        └──────────────────────┘
            ▼
      ┌──────────┐         ┌──────────┐        ┌──────────────┐
      │  Dues    │◄────────│DuePayment│───────►│   Payments   │
      └──────────┘         └──────────┘        └──────────────┘

┌─────────────────────┐
│ MaintenanceRequests │
└─────────────────────┘

┌────────────────┐
│ ChatSessions   │──────► ChatMessages
└────────────────┘

┌────────────┐         ┌──────────────────┐
│ Documents  │────────►│ DocumentChunks   │  (for AI chatbot)
└────────────┘         └──────────────────┘

┌────────────┐    ┌────────────────────────────┐    ┌────────────┐
│BoardMembers│    │UserNotificationPreferences │    │ AuditLog   │
└────────────┘    └────────────────────────────┘    └────────────┘
```

---

## Tables

### `hoas`

The tenant row. Phase 1 has one. Multi-tenant Phase 5 needs zero schema changes; the FKs already exist.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| name | TEXT | e.g., "Sunset Ridge Community" |
| slug | TEXT UNIQUE | URL-safe identifier |
| supported_languages | TEXT[] | e.g., `['en', 'es', 'tl']` |
| default_language | TEXT | default `en` |
| dues_cadence | ENUM | `monthly`, `quarterly`, `annual` |
| timezone | TEXT | IANA tz, e.g., `America/Los_Angeles` |
| resident_directory_visibility | ENUM | `off` (default), `admins_only`, `all_residents` — controls the optional Resident Directory in Module 6 |
| branding | JSONB NULL | logo URL, primary color, contact addresses |
| ai_monthly_budget_cents | INTEGER | hard cap for LLM spend; admin alerted at 80% |
| ai_per_user_daily_messages | INTEGER | chatbot rate limit per resident per day |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| deleted_at | TIMESTAMP NULL | soft-delete |

### `users`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | references `hoas.id` |
| email | TEXT | unique within (hoa_id, email) |
| password_hash | TEXT | |
| name | TEXT | |
| phone | TEXT NULL | |
| role | ENUM | `resident`, `admin` |
| status | ENUM | `pending`, `active`, `disabled` |
| preferred_language | TEXT | default inherits from `hoas.default_language` |
| directory_opt_out | BOOLEAN | default false — when true, user is hidden from the optional Resident Directory regardless of `hoas.resident_directory_visibility` |
| email_verified_at | TIMESTAMP NULL | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| deleted_at | TIMESTAMP NULL | soft-delete |

Note: `unit_id` is **not** on users. A user's current unit(s) are derived from `unit_residents` where `end_date IS NULL`. This lets a user move between units and lets past dues stay correctly attributed.

Unique index: `(hoa_id, lower(email))` where `deleted_at IS NULL`.

### `units`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| address | TEXT | |
| unit_number | TEXT NULL | |
| created_at | TIMESTAMP | |
| deleted_at | TIMESTAMP NULL | soft-delete |

### `unit_residents`

Tracks who lives in which unit and when. Always at least one row per active unit.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | denormalized for query speed |
| unit_id | UUID FK | |
| user_id | UUID FK | |
| start_date | DATE | when residency begins |
| end_date | DATE NULL | NULL = current resident |
| is_primary | BOOLEAN | one primary per unit, gets dues notices |
| created_at | TIMESTAMP | |

Constraint: only one row per `(unit_id, user_id)` with `end_date IS NULL`.
Constraint: only one row per `unit_id` with `is_primary = true AND end_date IS NULL`.
Index: `(user_id) WHERE end_date IS NULL` for "current units for this user".
Index: `(unit_id, end_date)` for "who lived here on date X".

### `announcements`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| author_id | UUID FK | references `users.id` |
| source_language | TEXT | language of `title`/`body` here, not assumed English |
| title | TEXT | |
| body | TEXT | rich text or markdown |
| image_url | TEXT NULL | |
| priority | ENUM | `general` (default), `critical` — see Module 2. `critical` email ignores `user_notification_preferences` opt-outs and gates translation-review for Critical sends (see AI Spec) |
| is_pinned | BOOLEAN | default false |
| pinned_until | TIMESTAMP NULL | auto-unpin after this time; NULL = manual unpin only |
| published_at | TIMESTAMP NULL | null = draft |
| scheduled_for | TIMESTAMP NULL | future publishing |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Background job unpins rows where `pinned_until < now()` to prevent the "20 stale pins" problem.

### `announcement_translations`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | denormalized |
| announcement_id | UUID FK | |
| language | TEXT | e.g., `es`, `tl`, `zh` |
| title | TEXT | |
| body | TEXT | |
| is_auto_translated | BOOLEAN | true if generated by AI |
| reviewed_by | UUID FK NULL | bilingual admin who verified, if any |
| reviewed_at | TIMESTAMP NULL | |
| created_at | TIMESTAMP | |

Unique: `(announcement_id, language)`.

### `dues`

A bill. Describes what is owed; not what was received.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| unit_id | UUID FK | |
| period | TEXT | e.g., `2026-05` for monthly |
| amount_cents | INTEGER | always store money as cents |
| due_date | DATE | |
| status | ENUM | `unpaid`, `partial`, `paid`, `late`, `waived` |
| notes | TEXT NULL | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

`status` is computed from `due_payments` totals + `due_date` vs `now()`. The column is maintained by application code (or a trigger) for fast indexing; do not let UI write it directly.

### `payments`

A receipt. Records that money came in. Phase 1 = manual admin entry. Phase 2 = Stripe webhook inserts.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| paid_by_user_id | UUID FK NULL | NULL if cash/check from a non-user |
| amount_cents | INTEGER | total received |
| method | ENUM | `cash`, `check`, `transfer`, `card`, `ach`, `waiver` |
| reference | TEXT NULL | check number, Stripe charge id, etc. |
| paid_at | TIMESTAMP | when the money was received |
| recorded_by_user_id | UUID FK | admin who entered the row |
| notes | TEXT NULL | |
| external_id | TEXT NULL | for idempotent webhook inserts (Phase 2) |
| created_at | TIMESTAMP | |

Unique partial index: `(hoa_id, external_id) WHERE external_id IS NOT NULL`.

### `due_payments`

Allocates a payment across one or more dues. Phase 1 typically has one row per payment (1:1 with a due); Phase 2 may split.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| due_id | UUID FK | |
| payment_id | UUID FK | |
| allocated_cents | INTEGER | how much of the payment goes to this due |
| created_at | TIMESTAMP | |

Constraint: `SUM(allocated_cents) WHERE payment_id = X` must equal `payments.amount_cents`. Enforce in app logic; optionally a trigger.

### `documents`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| title | TEXT | |
| category | ENUM | `bylaws`, `ccrs`, `minutes`, `financials`, `forms`, `other` |
| file_url | TEXT | S3/R2 URL |
| file_type | TEXT | mime type |
| file_size_bytes | BIGINT | |
| uploaded_by | UUID FK | references `users.id` |
| version | INTEGER | starts at 1, increments on replace |
| is_chatbot_indexed | BOOLEAN | true if eligible for Q&A bot |
| pii_review_status | ENUM | `pending`, `acknowledged_safe`, `flagged`, `excluded` |
| pii_reviewed_by | UUID FK NULL | admin who confirmed |
| pii_reviewed_at | TIMESTAMP NULL | |
| parent_document_id | UUID NULL | for version history |
| created_at | TIMESTAMP | |

A document cannot be indexed for the chatbot unless `pii_review_status = 'acknowledged_safe'`. The ingestion pipeline runs a PII scan (regex + NER for names/addresses/SSN-like patterns) and sets `pii_review_status = 'flagged'` if it finds hits; an admin must explicitly clear to `acknowledged_safe` before chunks land in the index.

### `document_chunks`

For the chatbot's vector search.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| document_id | UUID FK | |
| chunk_index | INTEGER | order within document |
| content | TEXT | the chunk text |
| page_number | INTEGER NULL | for citation |
| section | TEXT NULL | e.g., "Section 4.2" |
| embedding_model | TEXT | e.g., `openai/text-embedding-3-small` |
| embedding | VECTOR | dimension matches model; see note below |
| created_at | TIMESTAMP | |

**Embedding dimension**: pgvector requires a fixed dimension per column. Pick the model at deploy time and create the column with that dimension (e.g., 1536 for OpenAI `text-embedding-3-small`, 1024 for Voyage, 768 for some open models). If you later switch models, create a new column (`embedding_v2 VECTOR(N)`) and re-embed in the background — don't migrate in place. `embedding_model` records which model produced each row so a partial re-embed can target only the stale ones.

Index: `ivfflat` on `embedding` for fast similarity search, filtered by `hoa_id`.

### `maintenance_requests`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| submitted_by | UUID FK | references `users.id` |
| unit_id | UUID FK | |
| title | TEXT | |
| description | TEXT | |
| category | ENUM | `landscaping`, `plumbing`, `electrical`, `roads`, `pool`, `other` |
| photo_url | TEXT NULL | |
| status | ENUM | `new`, `in_progress`, `resolved`, `closed` |
| assigned_to | TEXT NULL | free-text vendor name for Phase 1 |
| admin_notes | TEXT NULL | internal, not shown to resident |
| resolved_at | TIMESTAMP NULL | |
| closed_at | TIMESTAMP NULL | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

Status semantics: `resolved` = admin marked the work done; `closed` = resident confirmed OR 14 days passed since `resolved_at` (auto-close background job, see Sprint 4). Both `resolved_at` and `closed_at` are retained for reporting.

### `board_members`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| name | TEXT | |
| role | TEXT | e.g., "President", "Treasurer" |
| email | TEXT NULL | |
| photo_url | TEXT NULL | |
| term_end | DATE NULL | |
| display_order | INTEGER | for sorting |
| created_at | TIMESTAMP | |

### `chat_sessions`

For the Q&A chatbot.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| user_id | UUID FK | |
| started_at | TIMESTAMP | |
| ended_at | TIMESTAMP NULL | |

### `chat_messages`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | denormalized for rate-limit queries |
| session_id | UUID FK | |
| role | ENUM | `user`, `assistant` |
| content | TEXT | |
| citations | JSONB NULL | array of `{document_id, page, section}` |
| feedback | ENUM NULL | `positive`, `negative` |
| tokens_in | INTEGER NULL | for cost tracking |
| tokens_out | INTEGER NULL | for cost tracking |
| cost_cents | INTEGER NULL | computed from tokens × model rate |
| created_at | TIMESTAMP | |

The per-user daily rate limit is enforced by counting rows where `role = 'user'` for `(user_id, created_at::date)`.

### `user_notification_preferences`

Per-user, per-type opt-in/out. Defaults are `email_enabled = true` for transactional types, `false` for digest types.

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| user_id | UUID FK | |
| type | TEXT | matches `notification_log.type` (e.g., `new_announcement`) |
| email_enabled | BOOLEAN | |
| sms_enabled | BOOLEAN | reserved for Phase 2 |
| updated_at | TIMESTAMP | |

Unique: `(user_id, type)`.

Send pipeline checks this table before queueing an email. Missing row = default behaviour (use a per-type default map in code).

### `audit_log`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| user_id | UUID FK | who performed the action |
| action | TEXT | e.g., `created_announcement`, `approved_user` |
| entity_type | TEXT | e.g., `announcement`, `user` |
| entity_id | UUID | |
| metadata | JSONB | additional context |
| created_at | TIMESTAMP | |

### `notification_log`

| Column | Type | Notes |
|--------|------|-------|
| id | UUID PK | |
| hoa_id | UUID FK | |
| user_id | UUID FK | recipient |
| channel | ENUM | `email` for Phase 1 |
| type | TEXT | e.g., `new_announcement`, `request_status_change` |
| subject | TEXT | |
| sent_at | TIMESTAMP | |
| status | ENUM | `sent`, `failed`, `bounced` |

This table grows fast. Partition by month or archive rows older than 90 days to a cold table.

---

## Indexes (Critical)

- `users (hoa_id, lower(email)) WHERE deleted_at IS NULL` — unique, login lookup
- `unit_residents (user_id) WHERE end_date IS NULL` — current units for user
- `unit_residents (unit_id, end_date)` — historical residency queries
- `dues (hoa_id, unit_id, period)` — fast lookups, unique
- `dues (hoa_id, status)` — delinquency queries
- `payments (hoa_id, paid_at DESC)` — recent receipts
- `due_payments (due_id)` and `due_payments (payment_id)` — both directions
- `announcements (hoa_id, published_at DESC) WHERE published_at IS NOT NULL` — the feed
- `announcements (is_pinned, published_at DESC) WHERE is_pinned = true` — pin queries
- `maintenance_requests (hoa_id, status, created_at)` — admin dashboard
- `document_chunks (embedding)` with `ivfflat`, filtered by `hoa_id` in WHERE — vector search
- `chat_messages (session_id, created_at)` — chat history rendering
- `chat_messages (hoa_id, user_id, created_at)` — rate limit / cost queries

---

## Data Retention

- Audit log: keep 2 years
- Notification log: keep 90 days hot, archive monthly
- Chat sessions: keep 1 year, then anonymize (drop `user_id`, keep content for chatbot improvement)
- Soft-delete (`deleted_at`) for `hoas`, `users`, `units` — never hard delete
- Document versions: keep all unless admin explicitly purges

---

## Migration order (for Sprint 0)

If building from scratch:

1. `hoas` (insert pilot row)
2. `units`, `users`, `unit_residents`
3. `user_notification_preferences`
4. `announcements`, `announcement_translations`
5. `documents`, `document_chunks`
6. `dues`, `payments`, `due_payments`
7. `maintenance_requests`
8. `board_members`
9. `chat_sessions`, `chat_messages`
10. `audit_log`, `notification_log`

Each migration in its own Prisma migration file. Keep them small so a failure rolls back cleanly.
