"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { Upload, FileText } from "lucide-react";
import { Button, FormWrapper, useFormFields, toast } from "@/components/ds";
import { api, extractErrorMessages } from "@/lib/api";
import { documentSchema, type TDocumentFormValues } from "../../_types";
import { CATEGORY_OPTIONS } from "../../_constant";

type DocumentFormProps = {
  mode: "create" | "edit";
  defaultValues: TDocumentFormValues;
  onSubmit: (values: TDocumentFormValues) => void | Promise<void>;
  loading?: boolean;
};

export function DocumentForm({ mode, defaultValues, onSubmit, loading }: DocumentFormProps) {
  const router = useRouter();
  const { FormInput, FormSelect, FormCheckbox } = useFormFields<TDocumentFormValues>();

  return (
    <FormWrapper<TDocumentFormValues>
      schema={documentSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-5"
    >
      <FormInput name="title" label="Title" placeholder="2026 Bylaws (Amended)" required />

      <FormSelect name="category" label="Category" options={CATEGORY_OPTIONS} />

      {mode === "create" ? <FileUploader /> : <ExistingFileSummary />}

      <div className="flex flex-col gap-3 rounded-md border border-border bg-surface-2 p-4">
        <FormCheckbox
          name="isChatbotIndexed"
          hint="If on, the document enters the chatbot index only after PII review clears."
        >
          Include in resident chatbot
        </FormCheckbox>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/documents")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Upload" : "Save changes"}
        </Button>
      </div>
    </FormWrapper>
  );
}

function FileUploader() {
  const form = useFormContext<TDocumentFormValues>();
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<{ name: string; size: number; type: string } | null>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post<{ url: string; fileType: string; fileSizeBytes: number; originalName: string }>(
        "/uploads",
        fd,
        { headers: { "content-type": "multipart/form-data" } },
      );
      form.setValue("fileUrl", res.data.url, { shouldValidate: true });
      form.setValue("fileType", res.data.fileType, { shouldValidate: true });
      form.setValue("fileSizeBytes", res.data.fileSizeBytes, { shouldValidate: true });
      if (!form.getValues("title")) {
        form.setValue("title", res.data.originalName.replace(/\.[^.]+$/, ""), { shouldValidate: true });
      }
      setUploaded({ name: res.data.originalName, size: res.data.fileSizeBytes, type: res.data.fileType });
      toast.success("File uploaded", "Now choose a category and save.");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Upload failed", message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-foreground">File</label>
      {uploaded ? (
        <div className="flex items-center gap-3 rounded-md border border-border bg-surface-2 p-3">
          <FileText size={18} className="text-foreground-subtle" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-foreground truncate">{uploaded.name}</span>
            <span className="text-xs text-foreground-subtle">{uploaded.type} · {(uploaded.size / 1024).toFixed(1)} KB</span>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => setUploaded(null)}>Replace</Button>
        </div>
      ) : (
        <label className="flex flex-col items-start gap-2 rounded-md border-2 border-dashed border-border-strong bg-surface-2 p-6 cursor-pointer">
          <Upload size={18} className="text-foreground-subtle" />
          <span className="text-sm text-foreground-muted">
            {uploading ? "Uploading…" : "Click to pick a PDF, DOCX, or image. Max 25 MB."}
          </span>
          <input
            type="file"
            accept=".pdf,.docx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/png,image/jpeg"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
      )}
    </div>
  );
}

function ExistingFileSummary() {
  const form = useFormContext<TDocumentFormValues>();
  const values = form.getValues();
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-surface-2 p-3">
      <FileText size={18} className="text-foreground-subtle" />
      <div className="flex flex-col text-xs text-foreground-muted">
        <span>{values.fileType}</span>
        <span>{Number(values.fileSizeBytes)} bytes</span>
      </div>
    </div>
  );
}
