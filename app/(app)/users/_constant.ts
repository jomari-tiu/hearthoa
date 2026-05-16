import type { TUserCreateValues, TUserEditValues } from "./_types";
import type { SelectOption } from "@/components/ds";

export const USERS_KEY = "users";

export const INIT_USER: TUserCreateValues = {
  email: "",
  name: "",
  phone: "",
  role: "resident",
  preferredLanguage: "en",
  password: "",
};

export const INIT_USER_EDIT: TUserEditValues = {
  name: "",
  phone: "",
  role: "resident",
  status: "active",
  preferredLanguage: "en",
};

export const ROLE_OPTIONS: SelectOption[] = [
  { label: "Resident", value: "resident" },
  { label: "Admin", value: "admin" },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
];

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "Tagalog", value: "tl" },
  { label: "Mandarin", value: "zh" },
];
