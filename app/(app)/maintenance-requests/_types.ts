import { z } from "zod";

export const MAINTENANCE_CATEGORIES = [
  "landscaping",
  "plumbing",
  "electrical",
  "roads",
  "pool",
  "other",
] as const;
export type TMaintenanceCategory = (typeof MAINTENANCE_CATEGORIES)[number];

export const MAINTENANCE_STATUSES = ["new", "in_progress", "resolved", "closed"] as const;
export type TMaintenanceStatus = (typeof MAINTENANCE_STATUSES)[number];

export const maintenanceSchema = z.object({
  title: z.string().min(1, "Title is required").max(140),
  description: z.string().min(1, "Description is required").max(2000),
  category: z.enum(MAINTENANCE_CATEGORIES),
  unitId: z.string().min(1, "Unit is required"),
  photoUrl: z.string().nullable().optional(),
});

export type TMaintenanceFormValues = z.infer<typeof maintenanceSchema>;

export type TMaintenanceRequest = TMaintenanceFormValues & {
  id: string;
  status: TMaintenanceStatus;
  submittedBy: { id: string; name: string };
  unit: { id: string; address: string; unitNumber: string | null };
  assignedTo: string | null;
  adminNotes: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
