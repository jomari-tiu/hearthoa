import type { TMaintenanceFormValues } from "./_types";
import type { SelectOption } from "@/components/ds";

export const MAINTENANCE_REQUESTS_KEY = "maintenance-requests";

export const INIT_MAINTENANCE: TMaintenanceFormValues = {
  title: "",
  description: "",
  category: "other",
  unitId: "",
  photoUrl: null,
};

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: "Landscaping", value: "landscaping" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Electrical", value: "electrical" },
  { label: "Roads / sidewalks", value: "roads" },
  { label: "Pool", value: "pool" },
  { label: "Other", value: "other" },
];
