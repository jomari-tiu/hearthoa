# Tech Stack & Architecture

## Recommended Tech Stack

This is a pragmatic stack chosen for speed of development, maintainability, and ease of finding developers.

### Frontend
- **Framework**: Next.js (React) — SSR-ready, great DX, easy deployment
- **Styling**: Tailwind CSS
- **UI components**: shadcn/ui or similar lightweight library
- **State**: React Query for server state, Zustand or Context for client state

### Backend
- **Runtime**: Node.js with Next.js API routes (or a separate Express/Nest backend if preferred)
- **Language**: TypeScript end to end
- **Authentication**: NextAuth.js or Clerk
- **File uploads**: Direct to object storage (S3, R2, or Supabase Storage)

### Database
- **Primary DB**: PostgreSQL (managed via Supabase, Neon, or RDS)
- **ORM**: Prisma — type-safe, migrations built in
- **Vector DB (for chatbot)**: pgvector extension in Postgres, or Pinecone/Weaviate if scaling demands it

### AI / LLM
- **LLM provider**: Anthropic Claude API or OpenAI API (DPA signed in Sprint 0; confirm "no training on customer data" in writing)
- **Embedding model**: OpenAI `text-embedding-3-small` or Cohere embed-v3 (recorded per-chunk in `document_chunks.embedding_model` so model switches don't require a full reindex)
- **Document parsing**: `pdf-parse` for PDFs, `mammoth` for DOCX, `tesseract.js` or a managed OCR API for scanned PDFs
- **PII scanning** (gate before embedding): `compromise` or `wink-nlp` for lightweight in-process NER (person names, addresses), plus regex for emails / phone / SSN-like patterns. For higher accuracy, optionally Presidio via a small Python service.

### CSV import/export
- **Parsing**: `papaparse` for CSV in / out
- **Validation**: Zod schemas per import type (residents, dues)
- **Idempotency**: each row carries an `external_id` so re-uploads are safe

### Email
- **Provider**: Resend, Postmark, or SendGrid
- **Templates**: React Email for type-safe HTML emails

### File Storage
- **Provider**: AWS S3, Cloudflare R2, or Supabase Storage
- **CDN**: CloudFront or Cloudflare in front of storage
- **Encryption at rest**: server-side encryption enabled on the bucket (S3 SSE-S3 / R2 default). No public bucket access.
- **Encryption in transit**: TLS 1.2+ enforced; HTTP is rejected.
- **Access**: signed, short-lived URLs (default 5 min TTL) for every download — file URLs in the DB are never directly browsable.

### Hosting
- **App**: Vercel (Next.js-native) or Railway / Render
- **Database**: Managed Postgres (Supabase, Neon, or AWS RDS)
- **Background jobs** (email sending, document ingestion): Inngest, Trigger.dev, or a simple queue with BullMQ

### Monitoring & Logging
- **Errors**: Sentry
- **Logs**: Better Stack, Axiom, or Datadog
- **Analytics**: PostHog or Plausible

### DevOps
- **Version control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Environments**: Local → Staging → Production

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                       │
│         Next.js + React + Tailwind (Responsive UI)          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│              Next.js App Router + API Routes                │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌─────────────────────┐      │
│  │   Auth     │ │  Modules   │ │   AI Endpoints      │      │
│  │ NextAuth   │ │ (CRUD ops) │ │ /draft, /translate, │      │
│  │            │ │            │ │  /chat              │      │
│  └────────────┘ └────────────┘ └─────────────────────┘      │
└──────┬─────────────────┬────────────────┬───────────────────┘
       │                 │                │
       ▼                 ▼                ▼
┌─────────────┐   ┌─────────────┐   ┌──────────────────┐
│ PostgreSQL  │   │ S3 / R2     │   │  External APIs   │
│ + pgvector  │   │ File store  │   │ - LLM (Claude)   │
│             │   │             │   │ - Embeddings     │
│ Users,      │   │ Documents,  │   │ - Email (Resend) │
│ Dues,       │   │ Photos,     │   │                  │
│ Requests,   │   │ Attachments │   │                  │
│ Embeddings  │   │             │   │                  │
└─────────────┘   └─────────────┘   └──────────────────┘
       ▲
       │
┌──────┴──────────────────────────────────────────────────────┐
│              BACKGROUND JOBS (Inngest)                      │
│  - Send email notifications (respects opt-outs;             │
│    Critical announcements bypass opt-outs)                  │
│  - Ingest documents (parse → PII scan → gate →              │
│    chunk → embed → store)                                   │
│  - Bulk resident import (CSV → invite emails)               │
│  - Bulk dues import (CSV → dues + payments + allocations)   │
│  - Bulk document export (zip + manifest, email link)        │
│  - Generate late status on dues                             │
│  - Auto-unpin announcements past `pinned_until`             │
│  - Auto-close resolved maintenance requests after 14 days   │
│  - Archive notification_log rows older than 90 days         │
│  - Daily summary digests                                    │
│  - AI budget monitor (80% alert, 100% gate)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## AI Feature Architecture Details

### Announcement Drafting Flow

```
Admin types note
      ↓
POST /api/ai/draft
      ↓
Server validates user (admin role)
      ↓
Server builds prompt with tone + length + HOA context
      ↓
Call LLM API
      ↓
Return JSON { title, body }
      ↓
Admin edits → publishes → triggers email job
```

### Document Q&A Chatbot Flow

**Ingestion (one-time per document)**
```
Admin uploads document
      ↓
Background job: parse → extract text (+ OCR if needed)
      ↓
PII scan: regex + NER
      ↓
   ┌──────────────┴──────────────┐
   ▼                             ▼
flagged                  acknowledged_safe
   ↓                             ↓
admin review queue       Split into chunks
   ↓                     (500–1000 tokens,
admin clears →           100-token overlap)
   ↓                             ↓
   └──────────────┬──────────────┘
                  ▼
        Generate embeddings
        (record embedding_model)
                  ▼
        Store in pgvector with metadata
        (hoa_id, doc_id, page, section)
```

**Query (every chatbot message)**
```
Resident asks question
      ↓
POST /api/ai/chat
      ↓
Embed question
      ↓
Vector similarity search → top 5 chunks
      ↓
Build prompt: system + chunks + chat history + question
      ↓
Call LLM API
      ↓
Return answer + citations [doc_id, page]
      ↓
Log Q&A for admin review
```

---

## Security Architecture

- **Authentication**: Session-based via NextAuth with JWT
- **Authorization**: Middleware checks role on every protected route; every domain query filters by `hoa_id` derived from the session — never from the request body
- **CSRF**: built-in via NextAuth
- **Rate limiting**: Upstash Rate Limit or similar on AI endpoints and login. Per-resident chatbot quota is enforced at the DB level (counted from `chat_messages`), not just at the rate-limit layer.
- **Input sanitization**: Zod schemas validate every API input
- **File upload validation**: MIME type + extension + size checks
- **Encryption at rest**: SSE on object storage; Postgres at-rest encryption (Supabase/Neon defaults satisfy this)
- **Encryption in transit**: TLS 1.2+ enforced end-to-end; HSTS header set
- **Signed URLs**: 5-min TTL for document downloads; bucket has no public access
- **Secrets**: stored in environment variables, never committed
- **Database access**: only through Prisma client, no raw SQL from user input
- **PII gate on chatbot ingestion**: documents cannot be embedded until `pii_review_status = 'acknowledged_safe'`
- **DPA**: signed with LLM vendor and email vendor in Sprint 0; "no training on customer data" confirmed in writing

---

## Scalability Considerations

For Phase 1 (single HOA, ~200 units):
- Single Vercel + managed Postgres instance is sufficient
- All AI calls are direct, no caching needed initially
- Background jobs handle async work without blocking requests

For Phase 2+ (multi-HOA, thousands of units):
- Add Redis caching layer for chatbot answers and document chunks
- Move vector DB to dedicated service (Pinecone) if pgvector queries slow
- Add read replicas for Postgres
- Consider self-hosted LLM for cost control

---

## Development Environment

- **Local**: Docker Compose with Postgres + pgvector, Mailhog for email testing
- **Staging**: full mirror of production on Vercel preview deployments
- **Production**: Vercel + Neon/Supabase + S3

---

## Alternative Stacks Considered

| Stack | Pros | Cons | Verdict |
|-------|------|------|---------|
| Django + React | Mature, batteries-included | Two codebases, slower iteration | Skip |
| Ruby on Rails | Great DX | Smaller talent pool today | Skip |
| Laravel + Vue | Popular in some regions | Less AI tooling ecosystem | Skip |
| **Next.js + TS** | One language, fast, AI-friendly | Vendor lock-in risk on Vercel | **Recommended** |
| Supabase-only | Very fast MVP | Less control over auth/business logic | Good for prototype, not production |
