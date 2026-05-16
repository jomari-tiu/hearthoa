import type { TDocumentFormValues } from "./_types";
import type { SelectOption } from "@/components/ds";

export const DOCUMENTS_KEY = "documents";

export const INIT_DOCUMENT: TDocumentFormValues = {
  title: "",
  category: "other",
  fileUrl: "",
  fileType: "",
  fileSizeBytes: 0,
  isChatbotIndexed: false,
};

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: "Bylaws", value: "bylaws" },
  { label: "CC&Rs", value: "ccrs" },
  { label: "Meeting Minutes", value: "minutes" },
  { label: "Financials", value: "financials" },
  { label: "Forms", value: "forms" },
  { label: "Other", value: "other" },
];

export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
