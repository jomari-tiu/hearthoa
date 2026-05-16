# Security

## Reporting a vulnerability

Email **security@hearthhoa.example** with the details. We acknowledge within 2 business days.

## Auth and session

- Passwords hashed with bcrypt (cost 12).
- Session is a JWT (HS256) stored in an httpOnly, sameSite=lax, secure (in prod) cookie.
- Cookie name: `hh_token`.
- TTL: 7 days. Rotation: re-issued on login.

## Tenant isolation

Every domain query filters by `hoa_id` derived from the session. The `hoa_id` is never read from the request body. Multi-tenant by design even in Phase 1.

## File access

- Storage abstraction in `lib/storage.ts` — local disk in dev, S3/R2 in prod with signed URLs (5-min TTL).
- `GET /api/files/[key]` requires a valid session; there is no public file route.

## AI

- Drafting and chat run only against text submitted by the user; no resident PII fields are passed to LLM providers.
- Chatbot ingestion is gated by `documents.pii_review_status = 'acknowledged_safe'`. Documents flagged by the PII scanner do not enter the chatbot index until an admin clears them.
- Per-resident chatbot rate limit enforced in the DB (`chat_messages` row counts).
- Per-HOA monthly AI budget cap with 80% alert and 100% hard-stop.

## Encryption

- TLS 1.2+ enforced at the edge (configure at deploy).
- Postgres at-rest encryption uses the managed-DB defaults (Supabase/Neon).
- Object storage requires server-side encryption (SSE-S3 / R2 default).

## Audit log

Every admin-initiated state change writes to `audit_log` with `(hoa_id, user_id, action, entity_type, entity_id, metadata)`.

## Data retention

- Audit log: 2 years.
- Notification log: 90 days hot, then archive monthly.
- Chat sessions: 1 year, then anonymize.
- Soft-delete (`deleted_at`) for `hoas`, `users`, `units`; never hard delete.
