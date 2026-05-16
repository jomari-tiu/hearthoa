-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('resident', 'admin');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('pending', 'active', 'disabled');

-- CreateEnum
CREATE TYPE "DuesCadence" AS ENUM ('monthly', 'quarterly', 'annual');

-- CreateEnum
CREATE TYPE "DirectoryVisibility" AS ENUM ('off', 'admins_only', 'all_residents');

-- CreateEnum
CREATE TYPE "AnnouncementPriority" AS ENUM ('general', 'critical');

-- CreateEnum
CREATE TYPE "DuesStatus" AS ENUM ('unpaid', 'partial', 'paid', 'late', 'waived');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'check', 'transfer', 'card', 'ach', 'waiver');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('bylaws', 'ccrs', 'minutes', 'financials', 'forms', 'other');

-- CreateEnum
CREATE TYPE "PiiReviewStatus" AS ENUM ('pending', 'acknowledged_safe', 'flagged', 'excluded');

-- CreateEnum
CREATE TYPE "MaintenanceCategory" AS ENUM ('landscaping', 'plumbing', 'electrical', 'roads', 'pool', 'other');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('new', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "FeedbackTone" AS ENUM ('positive', 'negative');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('email', 'sms');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('sent', 'failed', 'bounced');

-- CreateTable
CREATE TABLE "hoas" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "supported_languages" TEXT[],
    "default_language" TEXT NOT NULL DEFAULT 'en',
    "dues_cadence" "DuesCadence" NOT NULL,
    "timezone" TEXT NOT NULL,
    "resident_directory_visibility" "DirectoryVisibility" NOT NULL DEFAULT 'off',
    "branding" JSONB,
    "ai_monthly_budget_cents" INTEGER NOT NULL DEFAULT 20000,
    "ai_per_user_daily_messages" INTEGER NOT NULL DEFAULT 20,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "hoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'pending',
    "preferred_language" TEXT NOT NULL DEFAULT 'en',
    "directory_opt_out" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "address" TEXT NOT NULL,
    "unit_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_residents" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unit_residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "source_language" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image_url" TEXT,
    "priority" "AnnouncementPriority" NOT NULL DEFAULT 'general',
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "pinned_until" TIMESTAMP(3),
    "published_at" TIMESTAMP(3),
    "scheduled_for" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_translations" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "announcement_id" UUID NOT NULL,
    "language" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "is_auto_translated" BOOLEAN NOT NULL DEFAULT true,
    "reviewed_by" UUID,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dues" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "period" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "DuesStatus" NOT NULL DEFAULT 'unpaid',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "paid_by_user_id" UUID,
    "amount_cents" INTEGER NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "recorded_by_user_id" UUID NOT NULL,
    "notes" TEXT,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "due_payments" (
    "id" UUID NOT NULL,
    "due_id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "allocated_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "due_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size_bytes" BIGINT NOT NULL,
    "uploaded_by" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_chatbot_indexed" BOOLEAN NOT NULL DEFAULT false,
    "pii_review_status" "PiiReviewStatus" NOT NULL DEFAULT 'pending',
    "pii_reviewed_by" UUID,
    "pii_reviewed_at" TIMESTAMP(3),
    "parent_document_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_chunks" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "document_id" UUID NOT NULL,
    "chunk_index" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "page_number" INTEGER,
    "section" TEXT,
    "embedding_model" TEXT NOT NULL,
    "embedding" vector(1536),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_chunks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maintenance_requests" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "submitted_by" UUID NOT NULL,
    "unit_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "MaintenanceCategory" NOT NULL,
    "photo_url" TEXT,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'new',
    "assigned_to" TEXT,
    "admin_notes" TEXT,
    "resolved_at" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maintenance_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_members" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "photo_url" TEXT,
    "term_end" DATE,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "board_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_sessions" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "chat_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" UUID,
    "role" "ChatRole" NOT NULL,
    "content" TEXT NOT NULL,
    "citations" JSONB,
    "feedback" "FeedbackTone",
    "tokens_in" INTEGER,
    "tokens_out" INTEGER,
    "cost_cents" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notification_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "email_enabled" BOOLEAN NOT NULL DEFAULT true,
    "sms_enabled" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" UUID NOT NULL,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_log" (
    "id" UUID NOT NULL,
    "hoa_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "NotificationStatus" NOT NULL DEFAULT 'sent',

    CONSTRAINT "notification_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hoas_slug_key" ON "hoas"("slug");

-- CreateIndex
CREATE INDEX "users_hoa_id_idx" ON "users"("hoa_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_hoa_email_unique" ON "users"("hoa_id", "email");

-- CreateIndex
CREATE INDEX "units_hoa_id_idx" ON "units"("hoa_id");

-- CreateIndex
CREATE INDEX "unit_residents_user_id_end_date_idx" ON "unit_residents"("user_id", "end_date");

-- CreateIndex
CREATE INDEX "unit_residents_unit_id_end_date_idx" ON "unit_residents"("unit_id", "end_date");

-- CreateIndex
CREATE INDEX "announcements_hoa_id_published_at_idx" ON "announcements"("hoa_id", "published_at" DESC);

-- CreateIndex
CREATE INDEX "announcements_hoa_id_is_pinned_idx" ON "announcements"("hoa_id", "is_pinned");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_translations_announcement_id_language_key" ON "announcement_translations"("announcement_id", "language");

-- CreateIndex
CREATE INDEX "dues_hoa_id_status_idx" ON "dues"("hoa_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "dues_hoa_id_unit_id_period_key" ON "dues"("hoa_id", "unit_id", "period");

-- CreateIndex
CREATE INDEX "payments_hoa_id_paid_at_idx" ON "payments"("hoa_id", "paid_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "payments_hoa_external_id_unique" ON "payments"("hoa_id", "external_id");

-- CreateIndex
CREATE INDEX "due_payments_due_id_idx" ON "due_payments"("due_id");

-- CreateIndex
CREATE INDEX "due_payments_payment_id_idx" ON "due_payments"("payment_id");

-- CreateIndex
CREATE INDEX "documents_hoa_id_category_idx" ON "documents"("hoa_id", "category");

-- CreateIndex
CREATE INDEX "document_chunks_document_id_chunk_index_idx" ON "document_chunks"("document_id", "chunk_index");

-- CreateIndex
CREATE INDEX "maintenance_requests_hoa_id_status_created_at_idx" ON "maintenance_requests"("hoa_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "board_members_hoa_id_display_order_idx" ON "board_members"("hoa_id", "display_order");

-- CreateIndex
CREATE INDEX "chat_sessions_user_id_started_at_idx" ON "chat_sessions"("user_id", "started_at" DESC);

-- CreateIndex
CREATE INDEX "chat_messages_session_id_created_at_idx" ON "chat_messages"("session_id", "created_at");

-- CreateIndex
CREATE INDEX "chat_messages_hoa_id_user_id_created_at_idx" ON "chat_messages"("hoa_id", "user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_notification_preferences_user_id_type_key" ON "user_notification_preferences"("user_id", "type");

-- CreateIndex
CREATE INDEX "audit_log_hoa_id_created_at_idx" ON "audit_log"("hoa_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "notification_log_hoa_id_sent_at_idx" ON "notification_log"("hoa_id", "sent_at" DESC);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units" ADD CONSTRAINT "units_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_residents" ADD CONSTRAINT "unit_residents_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_residents" ADD CONSTRAINT "unit_residents_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_residents" ADD CONSTRAINT "unit_residents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_translations" ADD CONSTRAINT "announcement_translations_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_translations" ADD CONSTRAINT "announcement_translations_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_translations" ADD CONSTRAINT "announcement_translations_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dues" ADD CONSTRAINT "dues_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dues" ADD CONSTRAINT "dues_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_paid_by_user_id_fkey" FOREIGN KEY ("paid_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_recorded_by_user_id_fkey" FOREIGN KEY ("recorded_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "due_payments" ADD CONSTRAINT "due_payments_due_id_fkey" FOREIGN KEY ("due_id") REFERENCES "dues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "due_payments" ADD CONSTRAINT "due_payments_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_pii_reviewed_by_fkey" FOREIGN KEY ("pii_reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parent_document_id_fkey" FOREIGN KEY ("parent_document_id") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_members" ADD CONSTRAINT "board_members_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_sessions" ADD CONSTRAINT "chat_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notification_preferences" ADD CONSTRAINT "user_notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_hoa_id_fkey" FOREIGN KEY ("hoa_id") REFERENCES "hoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_log" ADD CONSTRAINT "notification_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
