# Next Phase Recommendations

After Phase 1 (MVP) is live and stable, here are the recommended features to add, organized by priority and value.

## What Phase 1 Has Already Unblocked

The MVP schema and infrastructure deliberately include hooks for several Phase 2+ items, so these will be small additions rather than rewrites:

- **Online Payments (Phase 2)** — `payments` and `due_payments` tables already exist; Stripe integration only needs a webhook handler that inserts a `payments` row with an `external_id` (Stripe charge id) and allocates against open dues.
- **SMS Notifications (Phase 2)** — `user_notification_preferences` already has `sms_enabled` per type; Twilio integration is the only new piece.
- **Multi-tenant SaaS (Phase 5)** — every domain table has `hoa_id`; tenant isolation becomes a query-level enforcement task, not a schema migration.
- **Resident history queries** — `unit_residents` history is in place, so any future feature that needs "who lived in unit X on date Y" (violations, dues attribution, ARC history) works without a schema change.
- **Cost / usage reporting** — `chat_messages.tokens_in/tokens_out/cost_cents` are populated from day one, so per-HOA AI billing or upsell tiers in a SaaS phase have data to draw on.

---

## Phase 2 — Priority Additions (Months 4–7 post-launch)

These are features that residents and boards consistently ask for and that build directly on Phase 1 modules.

### 1. Online Payments

**Why it matters**: Eliminates the biggest manual task for treasurers. Residents expect it.

**Scope**:

- Stripe or similar gateway integration
- One-time payments and auto-pay setup (ACH and card)
- Automatic dues reconciliation when payment received
- Receipts emailed automatically
- Refund handling for admins

**Effort**: 3–4 weeks

---

### 2. Amenity Reservations

**Why it matters**: A common pain point. Clubhouses and pools get double-booked or fought over.

**Scope**:

- Admin defines amenities and rules (max duration, advance booking limit, deposit)
- Resident books available slots
- Calendar view with conflict prevention
- Admin approval workflow if required
- Email confirmations and reminders

**Effort**: 2–3 weeks

---

### 3. Architectural Review (ARC) Workflow

**Why it matters**: Currently handled over email and paper. A digital workflow saves committee hours and creates a clean audit trail.

**Scope**:

- Resident submits request with description, photos, plans
- Routed to ARC committee members
- Committee discussion thread and voting
- Approval/denial with reason
- Resident notified, decision archived
- AI assist: pre-check against architectural guidelines

**Effort**: 3–4 weeks

---

### 4. Events Calendar with RSVPs

**Why it matters**: Helps the social committee, builds community.

**Scope**:

- Admin creates events
- Residents RSVP, see attendee list
- Calendar view (month/week)
- Email reminders before event
- Integration with announcement system

**Effort**: 1–2 weeks

---

### 5. SMS Notifications

**Why it matters**: Higher open rates than email for urgent items.

**Scope**:

- Twilio integration
- Resident opt-in with phone verification
- Per-notification-type opt-in (announcements, emergencies, dues)
- SMS templates for key events
- Cost monitoring

**Effort**: 1 week

---

## Phase 3 — Enhanced Operations (Months 8–12)

### 6. Violation Tracking

**Why it matters**: Reduces board friction and creates a fair, documented process.

**Scope**:

- Admin or patrol logs violation with photo and rule reference
- Escalation timeline: courtesy notice → first violation → fine → hearing
- Resident view of their notices, with appeal submission
- Hearing scheduling
- AI assist: drafting violation letters using CC&R references

**Effort**: 4 weeks

---

### 7. Voting & Polls

**Why it matters**: Annual elections, special assessments, and bylaw changes are clunky on paper.

**Scope**:

- Admin creates poll or formal vote
- Quorum tracking
- Secret ballot option for elections
- Proxy voting support
- Results published automatically when complete
- Audit trail for compliance

**Effort**: 3–4 weeks

---

### 8. Vendor Management

**Why it matters**: Boards struggle to track contracts, insurance, and history.

**Scope**:

- Vendor profiles with contact info, services, insurance certs
- Document attachment per vendor (contracts, COIs)
- Expiration alerts (insurance lapsing, contract renewal)
- Work order assignment from maintenance requests
- Payment history per vendor

**Effort**: 2–3 weeks

---

### 9. Discussion Forum / Community Board

**Why it matters**: Strengthens community, replaces fragmented social media groups.

**Scope**:

- Categories: General, For Sale, Lost & Found, Recommendations
- Moderation tools for admins
- Reporting flag for inappropriate content
- Email digest of top posts

**Effort**: 2–3 weeks

**Caution**: Moderation overhead is real. Consider if the community is large enough to justify.

---

### 10. Visitor / Contractor Pre-Registration

**Why it matters**: For gated communities, this is daily friction.

**Scope**:

- Resident pre-registers visitors with date/time window
- Generates gate code or QR pass
- Gate guard app/view (or integration with access control)
- Recurring registrations (regular contractors, family)

**Effort**: 2 weeks (more if integrating with hardware)

---

## Phase 4 — Advanced AI & Intelligence (Year 2)

### 11. Enhanced Chatbot Capabilities

- Answer questions about HOA financials (with permission)
- Help fill out forms (ARC, maintenance, reservations)
- Multi-turn task completion ("submit a maintenance request for my broken sprinkler")
- Voice input

---

### 12. AI-Powered Insights for the Board

- Spending anomaly detection
- Delinquency prediction
- Maintenance pattern analysis ("the pool pump usually fails around this time of year")
- Meeting minutes auto-summarization from recordings

---

### 13. AI Violation Detection from Photos

**Caution**: Sensitive and legally risky. Use only as a _suggestion_ tool, never autonomous enforcement.

- Resident or patrol uploads photo, AI flags potential violations
- Always requires human review before any notice issued
- Bias and fairness review required before deployment

---

### 14. Predictive Maintenance

- AI analyzes work order history to predict next failure
- Reminders for preventive maintenance
- Reserve study integration

---

## Phase 5 — Platform Expansion (Year 2+)

### 15. Mobile App (Native)

If web-responsive is no longer enough, build iOS/Android apps with push notifications.

**Effort**: 8–12 weeks per platform, or use React Native for shared codebase.

---

### 16. Multi-HOA / Multi-Tenant Support

Turn the portal into a SaaS product serving multiple HOAs.

**Scope**:

- Tenant isolation in database
- Per-tenant branding (logo, colors)
- Billing system for SaaS subscriptions
- Cross-tenant admin features
- Compliance: data isolation, per-tenant backups

**Effort**: 8–12 weeks. Major architectural shift.

---

### 17. Integrations Marketplace

- QuickBooks / accounting sync
- Google Calendar
- Smart home / IoT (smart locks, cameras)
- Property management software (Buildium, AppFolio)

---

## Prioritization Framework

When deciding what to build next, score each feature on:

1. **Resident demand** — how often is this requested?
2. **Board pain relief** — how much volunteer time does this save?
3. **Revenue impact** — if SaaS, does this enable upgrades or new tiers?
4. **Build complexity** — what's the engineering cost?
5. **Risk** — legal, security, reputational?

Build a simple matrix and revisit quarterly.

---

## Suggested Phase 2 Bundle

If budget is limited and you can only build a few of the above, this is the highest-impact combination:

1. **Online Payments** — biggest treasurer win
2. **Amenity Reservations** — biggest resident win
3. **SMS Notifications** — small effort, big perceived value
4. **ARC Workflow** — biggest committee win

**Total estimated effort**: 9–12 weeks for one developer.

---

## Long-Term Vision

The portal should eventually be the **single source of truth** for everything HOA-related — a place where:

- Residents handle all their interactions with the HOA without ever sending an email
- Board members make decisions with real data, not guesswork
- The community feels connected, informed, and well-managed
- AI handles the routine, freeing volunteers for the strategic and human work

Each phase moves closer to that vision while staying grounded in what genuinely helps people today.

---

## Recommended modules for scalability

Added during the Roles & Permissions + User Management increment. Each is a real module, not a feature flag. Numbered high-to-low priority by leverage.

### Near-term (Phase 2, months 1–3 post-launch)

1. **HOA Settings module** — admin UI for the `hoas` table fields nobody can currently change without `psql`: supported languages, default language, timezone, dues cadence, branding (logo URL, primary color), `aiMonthlyBudgetCents`, `aiPerUserDailyMessages`, resident-directory visibility. **High leverage, low effort** — the data already exists.
2. **Audit Log viewer** — admin UI over the existing `audit_log` table. Filter by user, action, entity. Required for compliance and trust. Data already accumulates.
3. **Notifications Center** — bell icon in the header with an unread count. Renders the same notification types `email-templates.ts` defines, but in-app. Backed by the existing `notification_log` table.
4. **Custom Roles** — the Phase 2 follow-up to the work in this increment. Two new tables (`roles`, `role_permissions`), Prisma enum still backs the six system roles, custom roles are FK'd from `users.custom_role_id`. UI: `/roles-and-permissions/new` page reusing the existing matrix component. Permission helpers in `lib/permissions.ts` become DB-aware behind the same API.
5. **Profile + Avatar upload** — every user gets a profile page they can edit themselves (name, phone, avatar, language, directory opt-out). Today these are scattered between settings + admin-edit. Uses existing storage abstraction.

### Mid-term (Phase 3, months 4–6)

6. **Online Payments (Stripe)** — schema is ready (`payments.external_id`).
7. **Amenity Reservations** — clubhouse, pool, BBQ slots. Calendar UI + conflict prevention. Stand-alone module.
8. **Events + Calendar** — RSVPs, reminders. Integrates with announcements.
9. **Two-Factor Authentication** — TOTP via authenticator app. Admin-only enforcement at first. Adds `users.totp_secret` + `users.totp_enabled`.
10. **Search (cmd-k)** — global search across announcements, documents, residents, dues, requests. Backed by Postgres `tsvector` columns.

### Long-term (Phase 4, year 2)

11. **Reports & Analytics dashboard** — dues collection rate, late-payment trends, AI cost over time, maintenance volume by category. Charts via Recharts.
12. **Webhooks + API tokens** — let property managers integrate. New `api_tokens` table with scoped permissions reusing `lib/permissions.ts`.
13. **Violation Tracking** — already on the .plans roadmap; needs the photo upload pipeline + escalation timeline.
14. **Voting & Polls** — quorum tracking, secret ballot, audit trail.
15. **Discussion Forum** — community board with moderation.

### Platform expansion (Phase 5+)

16. **Native Mobile (React Native)** — share the API; push notifications.
17. **Multi-Tenant SaaS** — `hoa_id` is already on every table, so this becomes a billing + onboarding wizard, not a data-model rewrite.
18. **Integrations Marketplace** — QuickBooks sync, Google Calendar, smart-lock hooks, Buildium/AppFolio bridges.
