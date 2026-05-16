import type { TAnnouncementFormValues } from "./_types";
import type { SelectOption } from "@/components/ds";

export const ANNOUNCEMENTS_KEY = "announcements";

export const INIT_ANNOUNCEMENT: TAnnouncementFormValues = {
  title: "",
  body: "",
  priority: "general",
  sourceLanguage: "en",
  isPinned: false,
  pinnedUntil: null,
};

export const PRIORITY_OPTIONS: SelectOption[] = [
  { label: "General — respects resident opt-outs", value: "general" },
  { label: "Critical — always emails everyone", value: "critical" },
];

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "Tagalog", value: "tl" },
  { label: "Mandarin", value: "zh" },
];
