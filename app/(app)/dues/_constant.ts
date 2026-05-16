import type { TDuesFormValues } from "./_types";
import type { SelectOption } from "@/components/ds";

export const DUES_KEY = "dues";

export const INIT_DUES: TDuesFormValues = {
  unitId: "",
  period: "",
  amountCents: 0,
  dueDate: "",
  notes: "",
};

export const STATUS_OPTIONS: SelectOption[] = [
  { label: "Unpaid", value: "unpaid" },
  { label: "Partial", value: "partial" },
  { label: "Paid", value: "paid" },
  { label: "Late", value: "late" },
  { label: "Waived", value: "waived" },
];
