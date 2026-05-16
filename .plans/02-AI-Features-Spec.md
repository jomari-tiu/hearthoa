# AI Features Specification — Phase 1

Phase 1 includes two AI-powered features designed for high value, low risk, and human-in-the-loop safety.

---

## Feature 1: Announcement Drafting + Translation

### Purpose
Help volunteer board members write clear, professional announcements quickly, and reach multilingual residents through automatic translation.

### User Flow

1. Admin clicks "New Announcement" in the dashboard.
2. Admin types a short note in plain language, e.g., *"pool closed sat for repairs 8am-2pm"*.
3. Admin clicks **"Draft with AI"**.
4. AI returns a polished announcement with title and body.
5. Admin reviews, edits if needed.
6. Optional: Admin clicks **"Translate"** and selects target language(s).
7. AI returns translated versions, each editable.
8. Admin publishes — all language versions are saved and shown to residents based on their language preference.

### Functional Requirements

- **Tone presets**: Friendly, Formal, Urgent (admin selects before drafting)
- **Length control**: Short (SMS-friendly), Standard, Detailed
- **Supported languages** (initial): English, Spanish, Tagalog, Mandarin (configurable per HOA)
- **Edit-in-place**: Admin can edit the AI output directly before publishing
- **Regenerate**: One-click to get a new draft if the first isn't quite right
- **History**: Last 10 drafts saved as drafts in case admin wants to revisit

### AI Implementation

- **Model**: A general-purpose LLM via API (e.g., Claude, GPT-4-class)
- **Prompt structure**:
  ```
  System: You are an HOA communications assistant. Write clear,
  respectful announcements for residents. Match the requested tone
  and length. Avoid jargon. Return JSON with "title" and "body".

  User: [tone: friendly] [length: standard]
  Draft note: "pool closed sat for repairs 8am-2pm"
  HOA name: Sunset Ridge Community
  ```

- **Translation prompt**:
  ```
  System: You are a professional translator. Translate the following
  HOA announcement to [TARGET_LANGUAGE]. Preserve tone, formatting,
  and any times/dates. Do not add or remove information.

  User: [original announcement text]
  ```

### Safety & Guardrails

- All AI output requires admin review before publishing (no auto-post)
- AI never sends communications directly to residents
- A small disclaimer near the AI button: *"Always review AI-generated content before publishing."*
- Translations include a tag: *"Translated automatically. Original in [SOURCE_LANGUAGE]."* The source language is stored on each `announcement_translations` row, so the tag is correct even when the source isn't English.

#### Translation review workflow

A monolingual admin cannot meaningfully verify a translation, so unreviewed translations are visibly marked and Critical announcements gate on review.

- Each translation row has `reviewed_by` and `reviewed_at` (see Data Model). Until populated, residents see a **"Machine-translated, unverified"** banner above the translated text.
- For each `supported_languages` entry on the HOA, the board can designate one or more bilingual reviewers. When a translation is generated, those reviewers receive a notification with a one-click "approve translation" action.
- For **Critical** announcements (see Module 2 in Phase 1 MVP), translations must be reviewed before the email send job runs. The job holds in queue until either (a) review is complete or (b) an admin explicitly waives review — waiver is logged in `audit_log`.
- For **General** announcements, translations may be published immediately and display the unverified banner until reviewed.

### Edge Cases

- If admin's note is too vague, AI asks a clarifying question instead of guessing
- If translation language is not supported, show clear error
- If API fails, fall back to plain text editor with a friendly error message

### Effort Estimate
**1–2 weeks** of development for a single engineer familiar with LLM APIs.

---

## Feature 2: CC&R / Document Q&A Chatbot

### Purpose
Allow residents to ask plain-language questions about HOA rules and get accurate answers with citations to the source documents — reducing email volume to the board.

### User Flow

1. Resident clicks the chatbot icon (persistent in bottom corner of portal).
2. Resident types a question, e.g., *"Can I paint my front door red?"*
3. Chatbot returns:
   - A clear answer in plain English
   - One or more citations linking to the exact section in the relevant document
   - A confidence indicator or a "Verify with the board" note if unsure
4. Resident can ask follow-up questions in the same conversation.
5. If the chatbot can't find an answer, it offers to draft an email to the board.

### Functional Requirements

- **Conversational interface** with chat history within the session
- **Citation links** that open the source document at the right page/section
- **Suggested questions** shown on first open ("What are the pool hours?", "What's the pet policy?")
- **Feedback buttons** (👍 / 👎) on each answer to improve over time
- **Admin view**: see common questions asked, which documents are referenced most, and where the bot failed to answer
- **Document refresh**: when admin uploads or updates a document, the chatbot index refreshes automatically

### AI Implementation — RAG (Retrieval-Augmented Generation)

This feature uses a Retrieval-Augmented Generation pattern. The chatbot does not "know" your HOA's documents — it searches them in real time and uses an LLM to synthesize an answer.

**Pipeline**:

1. **Ingestion** (when documents are uploaded)
   - Extract text from PDF/DOCX (run OCR if PDF has no embedded text)
   - **Run PII scan** on extracted text: regex pass (emails, phone numbers, SSN-like patterns, street addresses) + lightweight NER for person names. Any high-confidence hits set `documents.pii_review_status = 'flagged'` and surface them to the admin in a review queue. Chunking and embedding do NOT proceed for flagged docs until an admin clears the document to `acknowledged_safe`.
   - For cleared docs (`acknowledged_safe`), split into chunks (~500–1000 tokens each, with overlap)
   - Generate embeddings for each chunk using an embedding model; store `embedding_model` on each chunk so partial re-embeds are possible if you switch models later
   - Store chunks and embeddings in pgvector with metadata (`document_id`, `page_number`, `section`, `hoa_id`)

2. **Query time** (when resident asks a question)
   - Embed the question using the same embedding model
   - Search vector DB for top 3–5 most relevant chunks
   - Send chunks + question + system prompt to the LLM
   - LLM generates an answer using only the provided chunks
   - Return answer with source citations

**Prompt structure**:
```
System: You are an HOA assistant. Answer the resident's question
using ONLY the provided document excerpts. Cite the source document
and section for every claim. If the answer is not in the documents,
say "I couldn't find this in our HOA documents — please contact the
board." Do not guess or invent rules.

Context:
[chunk 1 — from CC&Rs, Section 4.2]
[chunk 2 — from Architectural Guidelines, Section 7]

User question: Can I paint my front door red?
```

### Safety & Guardrails

- **Strict grounding**: AI is instructed to never invent rules; if not in the docs, say so
- **Disclaimer banner** in the chatbot: *"AI assistant. Answers are based on HOA documents but should be verified with the board for official rulings."*
- **No financial or legal advice**: bot is instructed to refuse and redirect to the board
- **No PII leakage**: enforced by the mandatory `pii_review_status` gate (see *Ingestion Pipeline* and *Document Sources* below). Documents are not indexed until either the PII scan reports clean or an admin explicitly clears them to `acknowledged_safe`.
- **Audit log**: all questions and answers are logged for admin review

### Document Sources

- Documents are eligible for the chatbot index ONLY when BOTH conditions hold:
  - `documents.is_chatbot_indexed = true` (admin opt-in per document)
  - `documents.pii_review_status = 'acknowledged_safe'` (PII scan cleared or admin overrode)
- Sensitive financials, individual unit records, and similar are excluded by default and remain `is_chatbot_indexed = false`.
- When a document is replaced (version bump) or `is_chatbot_indexed` is toggled off, the prior chunks are deleted from the index in the same transaction so the chatbot never cites stale content.

### Edge Cases

- Ambiguous question → ask a clarifying follow-up
- Question outside HOA scope (e.g., "what's the weather?") → polite redirect
- Conflicting rules across documents → present both and recommend contacting the board
- Document not in resident's language → return answer in the document's language, optionally translated

### Effort Estimate
**2–4 weeks** of development. Most complex piece is the RAG pipeline (embeddings, vector DB, chunking strategy).

---

## Shared Considerations Across Both Features

### Cost Management

- Both features use paid LLM API calls.
- Estimated cost for a 200-unit HOA at typical usage: **$20–50/month** for drafting + translation, **$50–150/month** for chatbot. Unbounded chatbot usage by one motivated resident can exceed $500/month without limits — set them.
- **Per-resident chatbot rate limit**: default **20 messages per day**, configurable via `hoas.ai_per_user_daily_messages`. When hit, resident sees a friendly "you've reached today's limit, please try again tomorrow or contact the board" message. Enforced by counting `chat_messages WHERE role = 'user' AND user_id = X AND created_at::date = today`.
- **Per-admin drafting rate limit**: 50 drafts per day (high enough to never hit in normal use; low enough to catch a runaway loop).
- **Monthly HOA budget cap** via `hoas.ai_monthly_budget_cents`: at **80% of cap**, admin gets an email alert; at **100%**, AI features are gated with a "monthly AI budget reached" notice until the next billing period or until the admin raises the cap. Spend is summed from `chat_messages.cost_cents` plus per-draft cost records.
- Cache common chatbot answers (exact-match question dedupe within a 24h window per HOA) to reduce repeated API calls.
- Token usage and cost per chat message is stored in `chat_messages` (`tokens_in`, `tokens_out`, `cost_cents`) for accurate per-HOA reporting.

### Privacy
- No resident PII sent to AI APIs unless absolutely necessary
- If using a third-party LLM provider, confirm data is not used for training
- Anonymize logs before any review or analysis

### Model Provider Options
- **Anthropic Claude** — strong at following instructions, good for safe outputs
- **OpenAI GPT-4 family** — widely supported, large ecosystem
- **Open-source (Llama, Mistral)** — self-hosted, lower per-call cost, higher setup effort

For Phase 1, recommend starting with a commercial API to ship fast, evaluate cost, then consider self-hosting if usage scales.

### Monitoring
- Track per-feature usage: drafts generated, translations requested, chatbot questions asked
- Track feedback ratings on chatbot answers
- Alert if API error rate exceeds 5%

### Future Enhancements (Phase 2+)
- Voice input for chatbot
- Proactive announcement suggestions based on calendar (e.g., "It's December — draft a holiday lights reminder?")
- Multi-turn rewriting in announcement drafter ("make this shorter," "more formal")
- Chatbot answers reference past board decisions, not just documents
