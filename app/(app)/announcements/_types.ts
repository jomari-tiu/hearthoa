import { z } from "zod";

export const ANNOUNCEMENT_PRIORITIES = ["general", "critical"] as const;
export type TAnnouncementPriority = (typeof ANNOUNCEMENT_PRIORITIES)[number];

export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required").max(140, "Keep titles under 140 characters"),
  body: z.string().min(1, "Body is required").max(8000, "Body is too long"),
  priority: z.enum(ANNOUNCEMENT_PRIORITIES),
  sourceLanguage: z.string().min(2, "Language is required").default("en"),
  isPinned: z.boolean().default(false),
  pinnedUntil: z
    .string()
    .nullable()
    .optional()
    .transform((v) => (v === "" ? null : v ?? null)),
});

export type TAnnouncementFormValues = z.infer<typeof announcementSchema>;

export type TAuthorRef = {
  id: string;
  name: string;
};

export type TAnnouncement = TAnnouncementFormValues & {
  id: string;
  hoaId: string;
  authorId: string;
  author: TAuthorRef;
  imageUrl: string | null;
  publishedAt: string | null;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
};
