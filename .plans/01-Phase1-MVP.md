# Phase 1 — MVP Specification

## Objective

Deliver a functional HOA portal covering the most critical daily operations for residents and board members, with two AI features that demonstrate clear value from day one.

---

## Module 1: User Accounts & Authentication

### Description
Secure account system with admin-approved registration to prevent unauthorized access.

### Features
- Resident registration (requires admin approval before activation)
- Email and password login
- Password reset via email
- Two user roles: **Resident** and **Admin**
- Basic profile management (name, unit/address, phone, email)
- Admin can deactivate or remove accounts
- **Bulk import of resident emails/addresses** for fast rollout during onboarding (done by our support team if needed). Imported users land in `pending` status with a one-click invite email that sets their password.

### User Stories
- As a resident, I can register an account so the board can verify I live in the community.
- As an admin, I can approve or reject new registrations.
- As a user, I can reset my password if I forget it.
- As a board, I can hand a roster to the support team for bulk import so we don't onboard 200 residents one at a time.

### Acceptance Criteria
- Registration requires unit/address that admin can verify
- Email verification on signup
- Sessions expire after inactivity
- Admin dashboard shows pending registrations
- Bulk import accepts CSV with `email, name, unit, phone (optional), preferred_language (optional)`; rejects rows with invalid emails or missing required fields and shows a per-row error report.
- Data privacy compliance documentation available for boards upon request (retention policy, subprocessor list, DSAR process, AI data handling).

---

## Module 2: Announcements

### Description
A central feed where the board posts updates visible to all residents.

### Features
- Admin creates, edits, and deletes announcements
- Title, body text, optional image
- Publish immediately or schedule for later
- Each announcement is tagged **Critical** or **General**:
  - **Critical** → email is always sent, ignores opt-outs (used for emergencies, legal notices, dues reminders).
  - **General** → email respects each resident's preferences.
- Residents view announcements on their dashboard, newest first
- Pin important announcements to the top (with optional auto-unpin date)
- **Resident email preferences** — residents can opt out of non-essential ("general") email notifications. Required for compliance in some regions. Critical notifications cannot be opted out of and the UI says so clearly.
- **AI assist**: drafting and translation (see AI Features Spec)

### User Stories
- As an admin, I can post an announcement that all residents see immediately.
- As a resident, I receive an email when a new announcement is posted, unless I have opted out of general announcements.
- As a resident, I can opt out of non-essential emails without losing emergency notifications.
- As an admin, I can use AI to draft and translate announcements.

### Acceptance Criteria
- Announcements display in reverse chronological order
- Pinned items appear above unpinned
- Email notifications go out within 5 minutes of publishing
- Translation supports at least 2 languages (configurable)
- Board can mark each announcement as **Critical** (always emailed, ignores opt-outs) or **General** (respects resident opt-outs). Default is General; switching to Critical requires an explicit confirmation.
- Opt-out preferences are honored within 1 minute of save (no in-flight sends to opted-out users).

---

## Module 3: Dues Tracking

### Description
Track monthly or quarterly HOA dues per unit. Online payment integration is deferred to Phase 2.

### Features
- Admin records dues per unit (amount, period, due date)
- Bulk-generate dues for all units at the start of each cycle
- Mark dues as paid (manual entry of payment date and method)
- Residents view their balance and full payment history
- Late status flagged automatically after due date passes
- Export dues report to CSV
- **Simple dues CSV import** from legacy spreadsheets to kickstart tracking. Admin uploads a CSV; the importer matches rows to units, previews unmatched rows for manual mapping, and creates `dues` + `payments` records in one pass. Idempotent on re-upload (uses a row-level external_id).

### User Stories
- As a resident, I can see my current balance and past payments.
- As an admin, I can record a payment received offline.
- As an admin, I can see who is delinquent.
- As an admin, I can import our existing dues spreadsheet so we don't lose history when we move to the portal.

### Acceptance Criteria
- Dues calculations are accurate to the cent
- Status badges (Paid, Unpaid, Late) clearly visible
- CSV export includes all relevant fields for accounting
- Admin can export current and historic dues data for any period (filter by date range, by unit, by status), with totals and a per-unit running balance.
- CSV import reports per-row success/failure with a downloadable error file; partial imports leave the DB in a consistent state (transactional).

---

## Module 4: Document Library

### Description
Repository for HOA governing documents, meeting minutes, financial reports, and forms.

### Features
- Admin uploads PDF, DOCX, and image files
- Organize by category (Bylaws, CC&Rs, Minutes, Financials, Forms, Other)
- Residents browse, search, and download
- Track upload date and uploader
- Version history when files are replaced
- **One-click export of all documents** for board/annual archiving. Generates a zip with the current version of every document plus a `manifest.csv` (title, category, uploader, upload date, version). Long-running export runs as a background job; admin gets a download link by email when ready.
- **AI integration**: documents here power the Q&A chatbot (see AI Features Spec)

### User Stories
- As an admin, I can upload our HOA bylaws so all residents can access them.
- As a resident, I can search for and download the current CC&Rs.
- As an admin, I can replace a document and keep the old version archived.
- As a board, I can export all our documents at year-end for our records or to hand to a new management company.

### Acceptance Criteria
- File size limit: 25 MB per upload
- Search works on filename and category
- Documents are stored securely (access restricted to authenticated users)
- **Files encrypted at rest and in transit**: TLS 1.2+ for every transfer; S3/R2 server-side encryption (AES-256) on the storage bucket; database columns containing file URLs use signed, expiring access URLs (no public bucket access).
- Bulk export covers all documents the requesting admin can see, and is logged in the audit log.

---

## Module 5: Maintenance Requests

### Description
Residents submit requests for common-area issues; admins track and resolve them.

### Features
- Resident submits a request: title, description, category, photo upload
- Categories: Landscaping, Plumbing, Electrical, Roads/Sidewalks, Pool, Other
- Status workflow: **New → In Progress → Resolved → Closed**
- Admin can add internal notes and assign to a vendor (free text)
- Resident receives email when status changes
- Resident can view their own request history
- Admin sees all requests with filtering by status and category

### User Stories
- As a resident, I can report a broken sprinkler with a photo.
- As an admin, I can see all open requests in one place.
- As a resident, I get notified when my request is resolved.

### Acceptance Criteria
- Photo upload accepts JPG, PNG up to 10 MB
- Status changes trigger email notifications, subject to resident notification preferences. Status changes on the resident's own submitted requests are always sent regardless of opt-outs.
- Closed requests remain visible for historical reference
- Auto-close: requests in `resolved` for 14+ days are moved to `closed` by a background job; admins can manually close earlier.

---

## Module 6: Board Directory

### Description
Static page listing current board members and committee leads.

### Features
- Admin manages a list of board members
- Each entry: name, role (President, VP, Treasurer, etc.), photo, contact email, term end date
- Public to all logged-in residents
- Simple to update through the CMS
- **Resident Directory (optional)**: board can enable or disable a simple name/unit listing of all residents. Three visibility modes:
  - **Off** — no directory exists (default).
  - **Admins only** — only admins can view the resident list.
  - **All residents** — every logged-in resident can view it.
  Residents can individually opt out of appearing in the directory regardless of the HOA-level setting. Phone, email, and other PII are never shown — name and unit only.

### User Stories
- As a resident, I can see who is on the board and how to contact them.
- As an admin, I can update the board roster after elections.
- As a board, I can enable a resident directory for our community without exposing contact details.
- As a resident, I can opt out of appearing in the directory if I prefer privacy.

### Acceptance Criteria
- Board page accessible from main navigation
- Email addresses click-to-open mail client
- Photos optional but supported
- Resident Directory respects the HOA-level visibility setting and per-resident opt-out at every render. Changing the visibility setting takes effect immediately.
- Directory shows name + unit only; never phone, email, language, or status.

---

## Cross-Cutting Requirements

### Notifications
- Email is the primary notification channel for Phase 1
- Templates for: new announcement, status change on maintenance request, dues reminders, account approval
- SMS deferred to Phase 2

### Admin Dashboard
A landing page for admins showing:
- Pending registrations
- Open maintenance requests count
- Delinquent accounts count
- Recent announcements
- Quick links to create announcement, upload document, record payment

### Resident Dashboard
A landing page for residents showing:
- Current dues balance
- Recent announcements (top 3)
- Their open maintenance requests
- Quick links to submit a request, view documents, ask the chatbot

### Security
- HTTPS enforced
- Passwords hashed (bcrypt or argon2)
- File uploads scanned for type validation
- Role-based access control (RBAC) enforced server-side
- Audit log of admin actions

### Responsive Design
- Must work on desktop, tablet, and mobile browsers
- Mobile-first design for resident-facing pages

### Accessibility
- WCAG 2.1 AA compliance target
- Keyboard navigation supported
- Alt text required on uploaded images

---

## Module 7: User Management

### Description
Admin CRUD surface for portal users. Replaces the original dedicated "Pending approvals" page — pending users are now a filter on the canonical Users list at `/users?status=pending`.

### Features
- List of users for the HOA with search, pagination, and filters on `status` (pending / active / disabled) and `role`.
- Admin can **create** users directly (`/users/create`) — bypasses the public registration flow when the board wants to provision someone with a known password.
- Admin can **edit** name, phone, role, status, preferred language (`/users/[id]/edit`).
- Admin can **approve** or **reject** a pending user inline on the detail page; both actions audit-log.
- Admin can **soft-delete** a user (`deleted_at` flip + status disabled); audit-logged.
- Status filter is URL-driven (`/users?status=pending` etc.) so it works as a bookmarkable queue.

### Registration Flow

Used to be a sub-feature of Module 1. Promoted here because the end-to-end flow now spans both the public landing and admin user management.

1. Resident visits the public `/register` page.
2. Fills community code (HOA slug), name, email, password, unit address (+ optional unit number / phone).
3. Form posts to `POST /api/auth/register`:
   - Looks up the HOA by `slug`; 404 if unknown.
   - Rejects duplicate email per `hoa_id`.
   - bcrypt-hashes the password.
   - Creates user with `status = pending`, `role = resident`.
   - Writes an audit-log entry of action `registered`.
4. Resident sees a "we're verifying you" confirmation card. No session set.
5. Admin sees the pending user at `/users?status=pending`, opens the detail page, clicks **Approve** → `POST /api/users/[id]/approve` flips status to active and sets `email_verified_at`.
6. Resident receives an "account approved" email (template ready; delivery is a stub until Resend is wired in) and can sign in.

### User Stories
- As an admin, I can see a single list of every account in the community, filter to pending residents, and approve them with one click.
- As an admin, I can create a user directly with a known password (e.g. handing a tablet to an elderly resident on a board visit) without sending them through the registration flow.
- As a resident, I can self-register on the public site and know the board will reach me when they activate my account.
- As a security-conscious admin, I cannot accidentally lock myself out — the API blocks self-downgrade and self-disable.

### Acceptance Criteria
- `GET /api/users` is admin-only; resident requests return 403.
- The same list at `/users?status=pending` powers the pending-approval queue (no separate URL).
- Admin can change role between `resident` and `admin`, status between `pending`, `active`, `disabled`.
- An admin cannot disable or downgrade their own account; API returns 400 with a readable message.
- Soft-delete sets `deleted_at` and `status = disabled`; deleted users do not appear in `/api/users` or `/api/residents`.
- Every create / update / approve / reject / delete writes a row to `audit_log`.
- Self-registration creates `status = pending` users; pending users fail login with the same message as wrong-password (no account-state enumeration).

---

## Module 8: Roles & Permissions

### Description
Read-only page showing how each role maps to permissions. Source of truth: `lib/permissions.ts`. Phase 1 ships six modelled roles — `resident`, `admin`, `super_admin`, `treasurer`, `secretary`, `maintenance_lead`. Only `resident` and `admin` are activated by the Prisma `Role` enum; the rest are pre-modelled so adding them in Phase 2 is a one-line schema migration with zero route changes.

### Features
- Live matrix at `/roles-and-permissions` showing each defined role + its permission set, grouped into eight domains (Announcements, Documents, Dues & payments, Maintenance, Community, User management, AI & automation, Settings & audit).
- Each role card shows label, description, permission count, and a badge marking whether it's currently active (`resident` / `admin`) or queued for Phase 2.
- `GET /api/roles` exposes the same data programmatically; future Phase 2 work adds POST/PATCH for custom roles.

### User Stories
- As a board chair, I can audit at a glance what each role can and can't do, without reading code.
- As a new admin, I learn the shape of the permission model by reading the matrix before I'm asked to assign roles.
- As an engineer, I add a new permission string by editing `lib/permissions.ts`; the UI updates automatically.

### Acceptance Criteria
- The page is admin-only; resident attempts redirect to `/dashboard?notice=admin-only`.
- The matrix is generated from `ROLE_DEFINITIONS`; there is no separate source of role data.
- Permissions follow a `verb:resource[:scope]` naming convention (e.g. `announcements:write`, `dues:read:own`).
- API helper `requirePermission(session, perm)` throws `ApiError(403)` when missing; `hasPermission()` returns boolean.
- The Phase 1 page is read-only. Custom-role authoring lands in Phase 2.

---

## What's Explicitly NOT in Phase 1

To keep MVP scope tight, the following are deferred:

- Online payment processing
- Amenity reservations
- Architectural Review Committee (ARC) workflow
- Violation tracking
- Polls and voting
- Discussion forums
- Events calendar with RSVP
- Visitor/contractor pre-registration
- Mobile app (web-responsive only)
- SMS notifications
- Multi-HOA / multi-tenant support

These are addressed in the Next Phase Recommendations document.
