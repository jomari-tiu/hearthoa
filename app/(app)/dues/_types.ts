import { z } from "zod";

export const DUES_STATUSES = ["unpaid", "partial", "paid", "late", "waived"] as const;
export type TDuesStatus = (typeof DUES_STATUSES)[number];

export const PAYMENT_METHODS = ["cash", "check", "transfer", "card", "ach", "waiver"] as const;
export type TPaymentMethod = (typeof PAYMENT_METHODS)[number];

export const duesSchema = z.object({
  unitId: z.string().min(1, "Unit is required"),
  period: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM"),
  amountCents: z.number().int().nonnegative("Amount must be positive"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().nullable().optional(),
});

export type TDuesFormValues = z.infer<typeof duesSchema>;

export type TUnitRef = { id: string; address: string; unitNumber: string | null };

export type TPaymentRef = {
  id: string;
  amountCents: number;
  method: TPaymentMethod;
  paidAt: string;
  reference: string | null;
};

export type TAllocation = {
  id: string;
  paymentId: string;
  allocatedCents: number;
  payment: TPaymentRef;
};

export type TDue = TDuesFormValues & {
  id: string;
  hoaId: string;
  unit: TUnitRef;
  status: TDuesStatus;
  allocations: TAllocation[];
  createdAt: string;
  updatedAt: string;
};
