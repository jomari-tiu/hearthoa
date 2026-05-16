# Roles & Permissions — Phase 1

The single source of truth for **what a role can do** lives in `lib/permissions.ts`. The live matrix is rendered at **`/roles-and-permissions`** (admin-only); the API mirror is `GET /api/roles`.

Three places enforce these rules:

1. **UI** — `components/Sidebar.tsx` filters nav items by role; role-aware pages render different layouts.
2. **Middleware** — `middleware.ts` runs at the edge, verifies the JWT, and redirects residents away from admin URLs.
3. **API** — every route handler calls `requireSession()` or `requireAdmin()` from `lib/session.ts`, or the finer-grained `requirePermission(session, "verb:resource")` from `lib/permissions.ts`.

If the three disagree, the API is the source of truth.

---

## Roles (Phase 1 active vs Phase 2 modelled)

| Role | Active? | Stored as |
|---|---|---|
| **Resident** | ✅ Phase 1 | `users.role = 'resident'` |
| **Admin** | ✅ Phase 1 | `users.role = 'admin'` |
| **Super admin** | ⏸ Phase 2 | Will be `users.role = 'super_admin'` after enum extension |
| **Treasurer** | ⏸ Phase 2 | Will be `users.role = 'treasurer'` |
| **Secretary** | ⏸ Phase 2 | Will be `users.role = 'secretary'` |
| **Maintenance lead** | ⏸ Phase 2 | Will be `users.role = 'maintenance_lead'` |

Phase 2 modelled roles already exist in `ROLE_DEFINITIONS` (in `lib/permissions.ts`) with their permission sets defined. Activating them is **one Prisma migration** adding the value to the `Role` enum + a one-line update to `asRoleId()`. No route changes needed.

For Phase 2 we also gain **custom roles** stored in the database: admin can define `Pool Committee` (read announcements, read documents, manage pool reservations) without writing code.

---

## How permissions work

Each permission is a string of the shape `verb:resource[:scope]`. Examples:

- `announcements:read` — anyone signed in can read announcements
- `announcements:write` — only roles with this permission can post
- `dues:read:own` — resident sees their own dues
- `dues:read:all` — admin / treasurer sees everyone's

A role is a labelled bundle of permissions. The live matrix at `/roles-and-permissions` shows which permissions each role has.

Routes ask for permissions, not roles:

```ts
// Old: ask for the admin role
const session = await requireAdmin();

// New: ask for the specific permission
const session = await requireSession();
requirePermission(session, "announcements:write");
```

This means adding a **secretary** role that can write announcements but not see dues is automatic — they just have `announcements:write` in their bundle.

---

## What a RESIDENT can do

### Account
- Register at `/register`, sign in once admin approves
- Sign out, reset password
- Edit their own profile (name, phone, preferred language)
- Manage **notification preferences** (`/settings/notifications`) — Critical announcements bypass these
- Opt out of the **Resident Directory** (`users.directory_opt_out`)

### Read
- Dashboard (top 3 announcements, their open maintenance requests, quick actions, chatbot nudge)
- All **announcements** (translations follow `preferred_language`)
- All **documents** (download via signed URL)
- Their **own dues** and payment history
- **Board members** (name, role, contact email, term end)
- **Resident directory** — only when HOA has it enabled, names + units only of residents who haven't opted out

### Write
- **Submit a maintenance request** with photo, title, description, category, unit
- **Edit their own request** — title, description, category, photo only (not status, assignee, or admin notes)
- **Delete their own request** (admin retains the audit-log trail)
- Use the **AI chatbot** (rate-limited per `hoas.ai_per_user_daily_messages`)
- Feedback (👍 / 👎) on chatbot answers

### Sidebar
Dashboard · Announcements · Dues · Documents · Maintenance · Board · Residents · Notifications

---

## What a RESIDENT **CANNOT** do

### User management & community
- ❌ View, approve, reject, edit, or delete other accounts
- ❌ Visit `/users` or `/roles-and-permissions`
- ❌ Bulk-import residents
- ❌ Change HOA-wide directory visibility

### Announcements
- ❌ Post, edit, delete, pin
- ❌ Translate via AI or review translations
- ❌ Use "Draft with AI"

### Documents
- ❌ Upload, replace, delete
- ❌ Run the PII ingestion pipeline
- ❌ Clear flagged documents
- ❌ Bulk-export ZIP

### Dues & payments
- ❌ Record dues or payments
- ❌ See other residents' dues
- ❌ Import/export CSV

### Maintenance
- ❌ See other residents' requests
- ❌ Change `status`, `assignedTo`, or `adminNotes`

### Board & settings
- ❌ Add/edit/remove board members
- ❌ Touch HOA settings or AI budget
- ❌ View audit log or notification log

### Sidebar hides
Translations · PII review · **Users** · **Roles & permissions** · (and any `/create`/`/edit` URL is blocked by middleware)

---

## Edge cases (and what happens)

| The resident… | What happens |
|---|---|
| Types `/users` in the URL bar | Middleware redirects to `/dashboard?notice=admin-only` (HTTP 307) |
| Types `/announcements/create` | Same — middleware blocks `/create` and `/edit` for residents globally |
| Calls `POST /api/announcements` via fetch | API throws `ApiError(403, "Admin access required.")` |
| Calls `GET /api/maintenance-requests` | API returns **only their own** requests (route auto-filters `submittedById = session.userId` when role is resident) |
| Tries to `PATCH` a maintenance request's `status` | 403 — residents may only edit content fields |
| Hits the chatbot 21 times in a day | 429 with copy from `hoas.ai_per_user_daily_messages` |
| Account is `pending` | Login fails with the same message as wrong-password (no enumeration) |
| Account is `disabled` | Same as pending |
| JWT is expired or tampered | Middleware clears the cookie and redirects to `/` |
| Views a document with `pii_review_status != 'acknowledged_safe'` | Document still appears — PII gate only stops chatbot ingestion, not human downloads |

---

## Where each rule is enforced

| Surface | File | Mechanism |
|---|---|---|
| Sidebar nav filtering | `components/Sidebar.tsx` | `NAV.filter(i => i.roles.includes(role))` |
| Dashboard branch | `app/(app)/dashboard/page.tsx` | Server component branches on `session.role` |
| URL-level gating | `middleware.ts` | `isAdminOnly(pathname)` + `session.role === "resident"` → redirect |
| API auth | every `app/api/*/route.ts` | `requireSession()`, `requireAdmin()`, or `requirePermission(session, perm)` |
| Permission matrix | `lib/permissions.ts` | `ROLE_DEFINITIONS` + helpers `hasPermission()` / `requirePermission()` |
| Live matrix UI | `app/(app)/roles-and-permissions/page.tsx` | Renders `ROLE_DEFINITIONS` |
| Tenant scope | every API query | `WHERE hoa_id = session.hoaId` always |
| Maintenance resident-only filter | `app/api/maintenance-requests/route.ts` + `[id]/route.ts` | `if (role === 'resident') where.submittedById = session.userId` |
| Resident directory gating | `app/api/residents/route.ts` | `hoa.residentDirectoryVisibility` + `directory_opt_out` |
| Chatbot rate limit | `app/api/ai/chat/route.ts` | Counts `chat_messages WHERE user_id = X AND created_at::date = today` |

---

## Admin extras (for contrast)

Admins do everything a resident can, plus:

- All CRUD on announcements, documents, dues, board members, units, **users**
- Approve / reject pending registrations from `/users?status=pending`
- Manage maintenance state (`status`, `assignedTo`, `adminNotes`)
- Run document ingestion pipeline + clear PII flags
- Translate announcements via AI + sign off translations
- Use "Draft with AI" for announcement bodies
- Bulk import residents CSV + dues CSV
- Bulk export documents ZIP + dues CSV
- View AI monthly spend; set `aiMonthlyBudgetCents` / `aiPerUserDailyMessages`
- View audit log + notification log
- Toggle resident directory visibility
- View `/roles-and-permissions` matrix (read-only in Phase 1)

---

## Phase 2: Custom Roles

Two follow-ups deliver true RBAC:

1. **Enum extension** — add `super_admin`, `treasurer`, `secretary`, `maintenance_lead` to the Prisma `Role` enum and update `lib/permissions.ts::asRoleId()` to map them. Their permission bundles already exist; this unlocks them immediately.
2. **Custom roles** — add `roles` and `role_permissions` tables, plus `users.custom_role_id` FK. UI: `/roles-and-permissions/new` page reusing the existing matrix component. Permission helpers in `lib/permissions.ts` become DB-aware behind the same `hasPermission()` / `requirePermission()` API — routes don't change.

---

## Tests that protect this

- `tests/session.test.ts` — JWT round-trip + invalid-token rejection.
- `tests/integration/role-gates.test.ts` — 17 live API checks: resident cannot list users, cannot create announcements/documents/dues, cannot translate, cannot import; admin can; maintenance scoping returns only resident's own rows.
- `tests/e2e/role-gating.spec.ts` — 6 Playwright checks: sidebar hides admin-only items for residents, typing admin URLs bounces them, admin sees full sidebar and can open admin pages directly.
