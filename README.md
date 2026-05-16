# HearthHOA

A web-based HOA portal with CMS, dues, document library, maintenance requests, board directory, and two AI features (announcement drafting + translation, CC&R Q&A chatbot via RAG).

See `.plans/` for the original product specification.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** strict
- **Tailwind CSS** with OKLCH design tokens
- **Prisma** + **PostgreSQL + pgvector**
- **React Query** for server state
- **react-hook-form** + **Zod** for forms and validation
- **bcryptjs** + **jose** (JWT in httpOnly cookies) for auth
- **Anthropic Claude** for drafting/translation/chat; **OpenAI** embeddings (both optional — stubbed when env vars absent)

## Running locally

```bash
# Boot Postgres (pgvector) + Mailpit for email previews
docker compose up -d

# Env
cp .env.example .env
# (Optional) edit .env to add ANTHROPIC_API_KEY, OPENAI_API_KEY, RESEND_API_KEY

# DB schema + pilot HOA seed
npm run db:setup

# Run
npm run dev
# → http://localhost:3000
#   admin@sunset-ridge.test    / changeme1234
#   resident@sunset-ridge.test / changeme1234

# Tests
npm run test
```

## Project layout

Follows the `CLAUDE.md` FE rules and the data model in `.plans/04-Data-Model.md`.

```
app/
├── (app)/<module>/                # 5 CRUD modules + translations/imports/pii-review/settings
├── api/                           # 50+ route handlers (auth, modules, AI, cron, imports/exports)
├── _components/{Logo,LoginForm,ResetPasswordForm}
└── layout.tsx · providers.tsx · page.tsx · reset-password/page.tsx
components/{ds,Sidebar,ChatbotWidget}.tsx
lib/                                # api, auth, session, handler, prisma, format, utils,
                                    # storage, parsers, chunking, pii-scan, embeddings, email, email-templates
prisma/schema.prisma · prisma/seed.ts
tests/                              # vitest
```

## Production deployment checklist

This list mirrors the operational gaps called out in `.plans/03-Tech-Stack-and-Architecture.md` and `.plans/05-Timeline-and-Milestones.md`. **Do not ship without working through it.**

### Infrastructure
- [ ] Provision managed Postgres (Neon, Supabase, or RDS) with **pgvector extension enabled**
- [ ] Provision object storage (S3 / R2 / Supabase Storage) and swap `lib/storage.ts` from local-disk to signed S3 URLs
- [ ] Configure CDN in front of storage (CloudFront / Cloudflare)
- [ ] Set `JWT_SECRET` to a 48-byte random value (`openssl rand -base64 48`)
- [ ] Set `CRON_SECRET` to a random value and add it to the Vercel cron headers (or your scheduler)

### Email
- [ ] Sign with Resend / Postmark / SendGrid
- [ ] Wire `lib/email.ts` to the chosen provider
- [ ] Add SPF, DKIM, DMARC records for the sender domain
- [ ] Send a test of every template in `lib/email-templates.ts`

### Vendors / DPAs
- [ ] Sign a Data Processing Addendum with Anthropic (and confirm "no training on customer data" applies to your access tier)
- [ ] Sign a DPA with OpenAI if using embeddings
- [ ] Sign a DPA with your email provider
- [ ] Document all subprocessors in the compliance pack for boards

### Security
- [ ] Force HTTPS at the edge; HSTS preload
- [ ] Set the `secure` flag on the auth cookie in production (already in `app/api/auth/login/route.ts`)
- [ ] Rate-limit `/api/auth/login` and `/api/auth/forgot-password` at the edge (Upstash Rate Limit recommended)
- [ ] Configure Sentry for error reporting (`SENTRY_DSN`)
- [ ] Run `npm audit` and resolve high-severity issues

### Compliance
- [ ] Have an HOA-law attorney review against state-specific rules (Davis-Stirling, FL Ch.720, TX Property Code, etc.)
- [ ] Publish the data privacy compliance pack mentioned in Module 1's acceptance criteria
- [ ] Confirm CCPA / state-equivalent rights for residents (export, deletion)

### Observability
- [ ] Wire Sentry for FE and BE
- [ ] Set up uptime monitoring on `/api/auth/me`
- [ ] Cost dashboard reading from `chat_messages.cost_cents` and per-draft cost rows

### Accessibility
- [ ] Run axe / Lighthouse on every public page; target WCAG 2.1 AA
- [ ] Keyboard navigation tested on every form
- [ ] Alt text required on uploaded images

### AI
- [ ] Set `ANTHROPIC_API_KEY` (chatbot + drafting + translation)
- [ ] Set `OPENAI_API_KEY` (embeddings); pgvector column dim must match (1536 for `text-embedding-3-small`)
- [ ] Set `hoas.ai_monthly_budget_cents` to your starting cap; the system alerts at 80% and gates at 100%
- [ ] Set `hoas.ai_per_user_daily_messages` to the chatbot rate limit (default 20)
- [ ] Run the document ingestion endpoint on the pilot HOA's real CC&Rs before launch and tune the PII regex thresholds

### Testing
- [ ] Add integration tests against API routes with a test database
- [ ] Add Playwright e2e for: login, post announcement, upload document, submit maintenance request, chatbot conversation
- [ ] Hook tests into CI; block merges on red

### Operational rituals
- [ ] On-call rotation
- [ ] Weekly check-in with the pilot board for the first month
- [ ] Backup verification: prove you can restore from a point-in-time copy

## What's stubbed (and still works)

These modules degrade gracefully when external creds aren't set, so the app runs in dev without them:

- **AI drafting**: `POST /api/ai/draft` returns a hand-written stub when `ANTHROPIC_API_KEY` is missing.
- **AI chat**: `POST /api/ai/chat` records the question and returns a "I couldn't find this in our documents" answer.
- **Embeddings**: `lib/embeddings.ts` returns 1536-d zero vectors when `OPENAI_API_KEY` is missing. The pipeline runs but retrieval is meaningless.
- **Email**: `lib/email.ts` console-logs payloads when no provider key is set.
- **Storage**: `lib/storage.ts` writes to `./uploads/` when no S3 config is present.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint (max-warnings 0) |
| `npm run test` | Vitest |
| `npm run db:setup` | Migrate + seed |
| `npm run prisma:generate` | Regenerate Prisma client |
