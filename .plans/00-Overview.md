# HOA Portal — MVP Plan Overview

## Project Summary

A web-based HOA (Homeowners Association) portal with CMS capabilities, designed to streamline communication, dues tracking, document management, and maintenance requests for residents and board members. Phase 1 includes two AI-powered features to enhance admin productivity and resident self-service.

## Goals

- Centralize HOA operations in one accessible platform
- Reduce administrative workload for volunteer board members
- Improve resident experience through self-service tools
- Lay a scalable foundation for future enhancements

## Phase 1 Scope (MVP)

**Core Modules**
1. User Accounts & Authentication — public registration at `/register`, admin approval queue at `/users?status=pending`, bulk resident import for onboarding
2. Announcements — with Critical/General tagging and per-resident opt-out for general emails
3. Dues Tracking — with CSV import from legacy spreadsheets and period-filtered export
4. Document Library — with one-click bulk export for board archiving; encrypted at rest and in transit
5. Maintenance Requests
6. Board Directory — plus optional Resident Directory with per-HOA visibility modes and per-resident opt-out
7. User Management — admin CRUD over portal users, with role + status edits, soft-delete, and the pending-approvals queue at `/users?status=pending`
8. Roles & Permissions — read-only matrix of role → permission mappings, source-of-truth `lib/permissions.ts`. Six roles modelled (`resident`, `admin`, `super_admin`, `treasurer`, `secretary`, `maintenance_lead`); only `resident` and `admin` are active in Phase 1, the rest activate via a one-line enum extension

**AI-Powered Features**
1. Announcement Drafting + Translation — translations are flagged "machine-translated, unverified" until a bilingual reviewer signs off
2. CC&R / Document Q&A Chatbot — RAG with PII scan gate on ingestion and per-resident rate limits

**Foundational Decisions Baked In**
- Single-tenant Phase 1 but `hoa_id` is on every domain table from day one — multi-tenant SaaS in a later phase is a small migration, not a rewrite.
- Money is split into `dues` (what is owed) and `payments` + `due_payments` (what was received) so Stripe drops in cleanly in Phase 2.
- Residency is temporal: `unit_residents` tracks history so past dues stay attributed correctly.
- Notification preferences are per-user, per-type from day one (`user_notification_preferences`); Critical announcements (`announcements.priority = 'critical'`) bypass opt-outs by design.
- Chatbot ingestion is gated by `documents.pii_review_status` — no document is embedded until cleared.
- AI cost is bounded by per-resident rate limits and per-HOA monthly budget caps (`hoas.ai_per_user_daily_messages`, `hoas.ai_monthly_budget_cents`).

## Documents in This Plan

| File | Purpose |
|------|---------|
| `00-Overview.md` | This file — high-level summary |
| `01-Phase1-MVP.md` | Detailed Phase 1 MVP specification |
| `02-AI-Features-Spec.md` | Technical spec for the two AI features |
| `03-Tech-Stack-and-Architecture.md` | Recommended technology and system design |
| `04-Data-Model.md` | Database schema and entity relationships |
| `05-Timeline-and-Milestones.md` | Development phases and estimated timeline |
| `06-Next-Phase-Recommendations.md` | Suggested features for Phase 2 and beyond |
| `07-Roles-and-Permissions.md` | Role model, permission matrix, where each rule is enforced |

## Success Metrics for Phase 1

- 80%+ of residents activate their account within first month (bulk import drops the floor here from "every resident self-registers" to "every resident clicks the invite email")
- 50% reduction in board email volume for routine questions
- All HOA documents accessible online (100% migration)
- Maintenance request resolution time tracked and reduced
- AI chatbot answers 70%+ of resident document questions without escalation
- Email opt-out honored within 1 minute of save; Critical announcements still reach 100% of residents
- Zero documents enter the chatbot index without explicit PII review (`acknowledged_safe`)
- AI monthly spend stays within configured budget cap (`hoas.ai_monthly_budget_cents`)
