import { z } from "zod";

export const DOCUMENT_CATEGORIES = [
  "bylaws",
  "ccrs",
  "minutes",
  "financials",
  "forms",
  "other",
] as const;
export type TDocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export const PII_REVIEW_STATUSES = [
  "pending",
  "acknowledged_safe",
  "flagged",
  "excluded",
] as const;
export type TPiiReviewStatus = (typeof PII_REVIEW_STATUSES)[number];

export const documentSchema = z.object({
  title: z.string().min(1, "Title is required").max(180),
  category: z.enum(DOCUMENT_CATEGORIES),
  fileUrl: z.string().min(1, "Upload a file"),
  fileType: z.string().min(1),
  fileSizeBytes: z.number().int().nonnegative(),
  isChatbotIndexed: z.boolean().default(false),
});

export type TDocumentFormValues = z.infer<typeof documentSchema>;

export type TDocument = TDocumentFormValues & {
  id: string;
  hoaId: string;
  uploadedById: string;
  uploadedBy: { id: string; name: string };
  version: number;
  piiReviewStatus: TPiiReviewStatus;
  piiReviewedAt: string | null;
  parentDocumentId: string | null;
  createdAt: string;
};
