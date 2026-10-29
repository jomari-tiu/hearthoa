# Graph Report - hearthoa  (2026-10-23)

## Corpus Check
- 231 files · ~70,376 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: .css 5, (none) 2, .graphify-bak 1)

## Summary
- 1329 nodes · 3597 edges · 73 communities (59 shown, 14 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 103 edges (avg confidence: 0.85)
- Token cost: 166,329 input · 0 output

## Community Hubs (Navigation)
- Docs, Setup & Security
- Record Detail API Routes
- Collection API Routes
- Database Migration Schema
- File Parsing & Dependencies
- NPM Dependencies
- User Management UI
- App Shell & Login
- Chunking & Email Templates
- Chat, Auth & Prefs Routes
- List Pages & Query Hooks
- Cron Jobs & Exports
- HOA Design Components
- Login, Logout & Review Routes
- Form Inputs & Page Wrapper
- Dashboards & Bulk Import
- Document Upload Form
- Docs, Residents & Translations Pages
- Detail Pages & Delete Hooks
- Dues Form
- Announcement Form
- Maintenance Request Form
- Root Layout & Providers
- Tables & Dropdown Menus
- Form Field Helpers
- TypeScript Config
- Form Handlers & AI Draft
- Sandbox Showcase Page
- MVP Modules Spec
- Document Export & Ingest
- Board Member Form
- shadcn Config
- Permissions Map
- Sandbox Tweaks Panel
- Notification Settings
- Calendar & Date Picker
- NPM Scripts
- Dialog Components
- Auth Middleware
- Sandbox Display Widgets
- Success Metrics & AI Gates
- Stack & Security Architecture
- Document Detail API
- Sandbox Utilities
- Sandbox Buttons
- Sandbox Nav & Feedback
- Tenancy & AI Cost Design
- Dues & Payments Design
- Maintenance & Residency Design
- Data Model Tables
- AI Draft Route
- Board Member Detail API
- Roles & Permissions Design
- Chatbot & Phase 2 Features
- Button Components
- ESLint Config
- E2E Tests
- Board Members API
- Sandbox App Shell
- Graphify Instructions
- Next.js Config
- Sandbox Foundations
- Vercel Cron Config
- LLM Provider Options
- Violation Tracking

## God Nodes (most connected - your core abstractions)
1. `cn()` - 99 edges
2. `next` - 89 edges
3. `extractErrorMessages()` - 78 edges
4. `PageWrapper()` - 71 edges
5. `ApiError` - 71 edges
6. `Button` - 70 edges
7. `react` - 66 edges
8. `Badge()` - 61 edges
9. `Card` - 54 edges
10. `requireAdmin()` - 54 edges

## Surprising Connections (you probably didn't know these)
- `Tenant isolation via session-derived hoa_id` --semantically_similar_to--> `Foundational design decisions`  [INFERRED] [semantically similar]
  SECURITY.md → docs/HearthHOA-Documentation.pdf
- `Getting started / local setup (docker compose, Mailpit, seeded sunset-ridge HOA)` --semantically_similar_to--> `Running locally (docker compose, db:setup, npm run dev)`  [INFERRED] [semantically similar]
  docs/HearthHOA-Documentation.pdf → README.md
- `Production deployment checklist` --semantically_similar_to--> `Production deployment checklist`  [INFERRED] [semantically similar]
  docs/HearthHOA-Documentation.pdf → README.md
- `Stubbed integrations table` --semantically_similar_to--> `Stubbed integrations (graceful degradation)`  [INFERRED] [semantically similar]
  docs/HearthHOA-Documentation.pdf → README.md
- `Component sandbox route (/sandbox, always accessible)` --conceptually_related_to--> `HearthHOA Component Sandbox (index.html)`  [AMBIGUOUS]
  docs/HearthHOA-Documentation.pdf → sandbox/index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Phase 1 schema hooks that unblock later phases** — _plans_04_data_model_hoa_id_everywhere, _plans_04_data_model_money_split_principle, _plans_04_data_model_temporal_residency, _plans_06_next_phase_recommendations_multi_tenant_saas, _plans_06_next_phase_recommendations_online_payments_stripe, _plans_06_next_phase_recommendations_sms_notifications [EXTRACTED 1.00]
- **Document chatbot ingestion and query flow** — _plans_02_ai_features_spec_pii_scan_gate, _plans_02_ai_features_spec_rag_pipeline, _plans_04_data_model_documents, _plans_04_data_model_document_chunks, _plans_03_tech_stack_and_architecture_postgresql_pgvector, _plans_03_tech_stack_and_architecture_ai_chat_endpoint [EXTRACTED 1.00]
- **Permission enforcement across UI, middleware and API** — _plans_07_roles_and_permissions_middleware_url_gating, _plans_07_roles_and_permissions_require_permission, _plans_07_roles_and_permissions_role_definitions, _plans_07_roles_and_permissions_tenant_scope_enforcement, _plans_07_roles_and_permissions_lib_permissions_source_of_truth [EXTRACTED 1.00]
- **RAG document ingestion pipeline (upload -> PII scan -> review -> chunk + embed -> pgvector -> Claude answer)** — docs_hearthhoa_documentation_document_library_module, docs_hearthhoa_documentation_pii_gate, docs_hearthhoa_documentation_chunking_strategy, docs_hearthhoa_documentation_embeddings_text_embedding_3_small, docs_hearthhoa_documentation_rag_chatbot [EXTRACTED 1.00]
- **Local development environment (pgvector db + Mailpit + setup steps)** — docker_compose_db, docker_compose_mail, readme_local_setup, docs_hearthhoa_documentation_local_setup [INFERRED 0.85]
- **AI safety and cost controls** — security_ai_safeguards, docs_hearthhoa_documentation_pii_gate, docs_hearthhoa_documentation_ai_cost_controls, docs_hearthhoa_documentation_per_hoa_settings [INFERRED 0.85]

## Communities (73 total, 14 thin omitted)

### Community 0 - "Docs, Setup & Security"
Cohesion: 0.06
Nodes (45): db service (ankane/pgvector, port 5432, database hearthhoa), hearthhoa-pg volume, mail service (axllent/mailpit, SMTP 1025, UI 8025), HearthHOA Technical & User Documentation (v0.1.0 Phase 1 MVP), Accounts & Authentication module (registration, approval queue, password reset, bulk import), AI announcement drafting (POST /api/ai/draft, claude-sonnet-4-6), Announcement translation with reviewer sign-off, Announcements module (general/critical priority, pinning) (+37 more)

### Community 1 - "Record Detail API Routes"
Cohesion: 0.07
Nodes (42): AnnouncementRow, DELETE, GET, Params, PATCH, serialize(), UpdateInput, updateSchema (+34 more)

### Community 2 - "Collection API Routes"
Cohesion: 0.10
Nodes (37): AnnouncementRow, CreateInput, createSchema, GET, POST, serialize(), GET, CATEGORIES (+29 more)

### Community 3 - "Database Migration Schema"
Cohesion: 0.11
Nodes (43): "announcement_translations", announcement_translations_announcement_id_language_key, "announcements", announcements_hoa_id_is_pinned_idx, announcements_hoa_id_published_at_idx, "audit_log", audit_log_hoa_id_created_at_idx, "board_members" (+35 more)

### Community 4 - "File Parsing & Dependencies"
Cohesion: 0.05
Nodes (37): FormWrapperProps, extractText(), name, overrides, @types/react, @types/react-dom, private, version (+29 more)

### Community 5 - "NPM Dependencies"
Cohesion: 0.05
Nodes (42): dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, axios, bcryptjs, class-variance-authority, clsx, date-fns (+34 more)

### Community 6 - "User Management UI"
Cohesion: 0.11
Nodes (32): CreateForm(), CreateProps, EditForm(), EditProps, UserForm(), STATUS_LABEL, STATUS_TONE, UsersList() (+24 more)

### Community 7 - "App Shell & Login"
Cohesion: 0.09
Nodes (28): AppLayout(), INIT_LOGIN, LoginForm(), handleSubmit(), loginSchema, TLoginFormValues, Logo(), RegisterForm() (+20 more)

### Community 8 - "Chunking & Email Templates"
Cohesion: 0.08
Nodes (22): Chunk, chunkText(), inferSection(), accountApproved(), EmailTemplate, escapeHtml(), maintenanceStatusChange(), newAnnouncement() (+14 more)

### Community 9 - "Chat, Auth & Prefs Routes"
Cohesion: 0.07
Nodes (29): Input, POST, schema, Input, POST, schema, SECRET, POST (+21 more)

### Community 10 - "List Pages & Query Hooks"
Cohesion: 0.14
Nodes (23): useAnnouncements(), AnnouncementsPage(), useBoardMembers(), BoardMembersPage(), useDocuments(), DocumentsPage(), PiiReviewPage(), useDuesList() (+15 more)

### Community 11 - "Cron Jobs & Exports"
Cohesion: 0.09
Nodes (23): authorized(), GET(), authorized(), GET(), authorized(), GET(), POST, Row (+15 more)

### Community 12 - "HOA Design Components"
Cohesion: 0.17
Nodes (25): SandboxPage(), AiChatMessage(), AiChatMessageProps, AnnouncementCard(), AnnouncementCardProps, BudgetGauge(), BudgetGaugeProps, BulkImportDropProps (+17 more)

### Community 13 - "Login, Logout & Review Routes"
Cohesion: 0.12
Nodes (22): LoginInput, loginSchema, POST, POST, GET, Params, POST, GET (+14 more)

### Community 14 - "Form Inputs & Page Wrapper"
Cohesion: 0.09
Nodes (20): InputProps, SIZE_CLASS, Crumb, PageWrapperProps, AvatarImage, Input, InputProps, Props (+12 more)

### Community 15 - "Dashboards & Bulk Import"
Cohesion: 0.12
Nodes (22): AdminDashboard(), QUICK_LINKS, Announcement, MyRequest, QUICK_LINKS, ResidentDashboard(), STATUS_TONE, DashboardPage() (+14 more)

### Community 16 - "Document Upload Form"
Cohesion: 0.13
Nodes (25): DocumentForm(), DocumentFormProps, ExistingFileSummary(), FileUploader(), handleFile(), CATEGORY_OPTIONS, DOCUMENTS_KEY, INIT_DOCUMENT (+17 more)

### Community 17 - "Docs, Residents & Translations Pages"
Cohesion: 0.11
Nodes (22): DocItem, Resident, ResidentsPage(), useResidents(), Translation, INIT, schema, Values (+14 more)

### Community 18 - "Detail Pages & Delete Hooks"
Cohesion: 0.14
Nodes (22): useDeleteAnnouncement(), AnnouncementDetailsPage(), DetailRow(), useDeleteBoardMember(), BoardMemberDetailsPage(), useDeleteDue(), useDue(), useUpdateDue() (+14 more)

### Community 19 - "Dues Form"
Cohesion: 0.11
Nodes (22): DuesForm(), DuesFormProps, DUES_KEY, INIT_DUES, STATUS_OPTIONS, CreateDuesPage(), handleSubmit(), ListArgs (+14 more)

### Community 20 - "Announcement Form"
Cohesion: 0.16
Nodes (21): AnnouncementForm(), AnnouncementFormProps, ANNOUNCEMENTS_KEY, INIT_ANNOUNCEMENT, LANGUAGE_OPTIONS, PRIORITY_OPTIONS, CreateAnnouncementPage(), handleSubmit() (+13 more)

### Community 21 - "Maintenance Request Form"
Cohesion: 0.16
Nodes (21): MaintenanceForm(), MaintenanceFormProps, CATEGORY_OPTIONS, INIT_MAINTENANCE, MAINTENANCE_REQUESTS_KEY, CreateMaintenanceRequestPage(), handleSubmit(), ListArgs (+13 more)

### Community 22 - "Root Layout & Providers"
Cohesion: 0.08
Nodes (24): metadata, mono, RootLayout(), sans, Providers(), devDependencies, autoprefixer, eslint (+16 more)

### Community 23 - "Tables & Dropdown Menus"
Cohesion: 0.18
Nodes (20): Table(), TableProps, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, Table (+12 more)

### Community 24 - "Form Field Helpers"
Cohesion: 0.15
Nodes (18): Textarea, TextareaProps, CommonFieldProps, FieldShell(), FieldShellProps, useFormFields(), fieldId(), FormCheckbox() (+10 more)

### Community 25 - "TypeScript Config"
Cohesion: 0.09
Nodes (21): compilerOptions, allowJs, esModuleInterop, forceConsistentCasingInFileNames, incremental, isolatedModules, jsx, lib (+13 more)

### Community 26 - "Form Handlers & AI Draft"
Cohesion: 0.12
Nodes (21): DraftWithAi(), handleDraft(), handleDelete(), handleSubmit(), handleSubmit(), handleDelete(), CreateDocumentPage(), handleSubmit() (+13 more)

### Community 27 - "Sandbox Showcase Page"
Cohesion: 0.14
Nodes (13): BUTTON_SIZES, BUTTON_VARIANTS, Row, Section(), TABLE_COLS, TABLE_ROWS, TONES, VARIANTS (+5 more)

### Community 28 - "MVP Modules Spec"
Cohesion: 0.13
Nodes (18): HOA Portal MVP Overview, Admin Dashboard, One-click Bulk Document Export (zip + manifest.csv), Module 2: Announcements, Module 6: Board Directory, Module 4: Document Library, Module 7: User Management, Explicitly Not in Phase 1 (deferred scope) (+10 more)

### Community 29 - "Document Export & Ingest"
Cohesion: 0.16
Nodes (13): GET, inferExt(), maskValue(), Params, POST, GET, Params, POST (+5 more)

### Community 30 - "Board Member Form"
Cohesion: 0.27
Nodes (12): BoardMemberForm(), BoardMemberFormProps, BOARD_MEMBERS_KEY, INIT_BOARD_MEMBER, CreateBoardMemberPage(), useBoardMember(), useCreateBoardMember(), useUpdateBoardMember() (+4 more)

### Community 31 - "shadcn Config"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 32 - "Permissions Map"
Cohesion: 0.16
Nodes (14): ADMIN_PERMS, asRoleId(), hasPermission(), MAINTENANCE_LEAD_PERMS, Permission, PERMISSIONS, permissionsFor(), requirePermission() (+6 more)

### Community 33 - "Sandbox Tweaks Panel"
Cohesion: 0.23
Nodes (11): TweakColor(), TweakRadio(), TweakRow(), TweakSection(), TweakSelect(), TweakSlider(), TweaksPanel(), TweakText() (+3 more)

### Community 34 - "Notification Settings"
Cohesion: 0.21
Nodes (9): NotificationsSettingsPage(), Preference, TYPE_LABELS, Channel(), NotificationPrefRow(), NotificationPrefRowProps, Label, Switch (+1 more)

### Community 35 - "Calendar & Date Picker"
Cohesion: 0.19
Nodes (8): Calendar(), CalendarProps, DatePicker(), DatePickerProps, PopoverContent, date-fns, @radix-ui/react-popover, react-day-picker

### Community 36 - "NPM Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, db:setup, dev, lint, prisma:generate, prisma:migrate, prisma:seed (+5 more)

### Community 38 - "Dialog Components"
Cohesion: 0.29
Nodes (8): DialogProps, DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogOverlay, DialogTitle, @radix-ui/react-dialog

### Community 39 - "Auth Middleware"
Cohesion: 0.22
Nodes (10): ADMIN_ONLY_PREFIXES, ADMIN_ONLY_SUFFIX_PATTERNS, ALWAYS_ALLOWED, config, isAdminOnly(), middleware(), PUBLIC_PATHS, SECRET (+2 more)

### Community 41 - "Success Metrics & AI Gates"
Cohesion: 0.27
Nodes (8): Phase 1 Success Metrics, Bulk Resident Import (CSV), Module 1: User Accounts & Authentication, Monthly HOA AI Budget Cap (80% alert, 100% gate), Background Jobs (Inngest), PostgreSQL + pgvector, document_chunks table, documents table

### Community 42 - "Stack & Security Architecture"
Cohesion: 0.22
Nodes (8): NextAuth.js (JWT sessions), Next.js + TypeScript Stack, Encrypted Object Storage with Signed URLs (S3/R2), Prisma ORM, Security Architecture, Tech Stack & Architecture, Middleware URL Gating (isAdminOnly redirect), Role Gate Tests (session, integration, e2e)

### Community 43 - "Document Detail API"
Cohesion: 0.24
Nodes (9): CATEGORIES, DELETE, DocumentRow, GET, Params, PATCH, serialize(), UpdateInput (+1 more)

### Community 44 - "Sandbox Utilities"
Cohesion: 0.29
Nodes (6): CodeBlock(), escapeHTML(), highlightJSX(), Icon(), ICON_PATHS, Variant()

### Community 45 - "Sandbox Buttons"
Cohesion: 0.27
Nodes (4): Avatar(), AvatarStack(), hashHue(), UserChip()

### Community 47 - "Sandbox Nav & Feedback"
Cohesion: 0.24
Nodes (4): Breadcrumbs(), ConfirmDialog(), Modal(), TopBarMock()

### Community 48 - "Tenancy & AI Cost Design"
Cohesion: 0.25
Nodes (7): AI Cost Management, Per-resident Chatbot Rate Limit (20/day), POST /api/ai/chat, hoas table, HOA Settings Module, Multi-HOA / Multi-Tenant SaaS, Tenant Scope (WHERE hoa_id = session.hoaId)

### Community 49 - "Dues & Payments Design"
Cohesion: 0.31
Nodes (8): Dues CSV Import (idempotent), Module 3: Dues Tracking, CSV Import/Export (papaparse + Zod + external_id), due_payments table, dues table, payments table, units table, Online Payments (Stripe)

### Community 50 - "Maintenance & Residency Design"
Cohesion: 0.22
Nodes (7): Module 5: Maintenance Requests, Data Retention Policy, maintenance_requests table, unit_residents table, users table, Two-Factor Authentication (TOTP), Maintenance Resident-only Filter

### Community 51 - "Data Model Tables"
Cohesion: 0.33
Nodes (9): announcement_translations table, announcements table, board_members table, chat_messages table, chat_sessions table, Data Model Phase 1, notification_log table, user_notification_preferences table (+1 more)

### Community 52 - "AI Draft Route"
Cohesion: 0.31
Nodes (8): checkBudget(), Input, LENGTH_GUIDANCE, POST, schema, stubBody(), stubTitle(), TONE_GUIDANCE

### Community 53 - "Board Member Detail API"
Cohesion: 0.28
Nodes (8): BoardMemberRow, DELETE, GET, Params, PATCH, serialize(), UpdateInput, updateSchema

### Community 54 - "Roles & Permissions Design"
Cohesion: 0.39
Nodes (8): Module 8: Roles & Permissions, Custom Roles (roles + role_permissions tables), Webhooks + API Tokens, lib/permissions.ts (permission source of truth), verb:resource[:scope] Permission Convention, requirePermission / hasPermission, ROLE_DEFINITIONS, Six Modelled Roles (2 active, 4 Phase 2)

### Community 55 - "Chatbot & Phase 2 Features"
Cohesion: 0.25
Nodes (6): Resident Dashboard, CC&R / Document Q&A Chatbot, Amenity Reservations, Architectural Review (ARC) Workflow, SMS Notifications (Twilio), Suggested Phase 2 Bundle

### Community 56 - "Button Components"
Cohesion: 0.36
Nodes (6): ButtonProps, Button, ButtonProps, buttonVariants, class-variance-authority, @radix-ui/react-slot

### Community 57 - "ESLint Config"
Cohesion: 0.29
Nodes (3): compat, __dirname, __filename

### Community 58 - "E2E Tests"
Cohesion: 0.29
Nodes (3): @playwright/test, ADMIN, RESIDENT

### Community 59 - "Board Members API"
Cohesion: 0.40
Nodes (5): BoardMemberRow, CreateInput, createSchema, POST, serialize()

### Community 60 - "Sandbox App Shell"
Cohesion: 0.40
Nodes (5): App(), NAV_GROUPS, root, SANDBOX_DEFAULTS, ThemeToggle()

### Community 61 - "Graphify Instructions"
Cohesion: 0.50
Nodes (3): .claude/CLAUDE.md (graphify skill instructions), graphify skill (/graphify trigger), CLAUDE.md (project instructions)

## Ambiguous Edges - Review These
- `HearthHOA Component Sandbox (index.html)` → `Component sandbox route (/sandbox, always accessible)`  [AMBIGUOUS]
  docs/HearthHOA-Documentation.pdf · relation: conceptually_related_to

## Knowledge Gaps
- **49 isolated node(s):** `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@radix-ui/react-scroll-area`, `@radix-ui/react-toast`, `js-cookie` (+44 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 478 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Login, Logout & Review Routes` to `Record Detail API Routes`, `Collection API Routes`, `File Parsing & Dependencies`, `User Management UI`, `App Shell & Login`, `Chat, Auth & Prefs Routes`, `List Pages & Query Hooks`, `Cron Jobs & Exports`, `Form Inputs & Page Wrapper`, `Dashboards & Bulk Import`, `Document Upload Form`, `Docs, Residents & Translations Pages`, `Detail Pages & Delete Hooks`, `Dues Form`, `Announcement Form`, `Maintenance Request Form`, `Root Layout & Providers`, `Document Export & Ingest`, `Board Member Form`, `Auth Middleware`, `Document Detail API`, `AI Draft Route`, `Board Member Detail API`, `Board Members API`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **What connects `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `@radix-ui/react-scroll-area` to the rest of the system?**
  _49 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Docs, Setup & Security` be split into smaller, more focused modules?**
  _Cohesion score 0.05878084179970972 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Form Inputs & Page Wrapper` to `File Parsing & Dependencies`, `User Management UI`, `App Shell & Login`, `List Pages & Query Hooks`, `HOA Design Components`, `Dashboards & Bulk Import`, `Document Upload Form`, `Docs, Residents & Translations Pages`, `Detail Pages & Delete Hooks`, `Announcement Form`, `Maintenance Request Form`, `Root Layout & Providers`, `Tables & Dropdown Menus`, `Form Field Helpers`, `Sandbox Showcase Page`, `Board Member Form`, `Notification Settings`, `Calendar & Date Picker`, `Dialog Components`, `Button Components`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `Record Detail API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.07180851063829788 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `Chunking & Email Templates` to `List Pages & Query Hooks`, `Collection API Routes`, `File Parsing & Dependencies`, `Login, Logout & Review Routes`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `HearthHOA Component Sandbox (index.html)` and `Component sandbox route (/sandbox, always accessible)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._