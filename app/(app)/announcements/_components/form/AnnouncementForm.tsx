"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormContext } from "react-hook-form";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Button, FormWrapper, useFormFields, Input, toast } from "@/components/ds";
import { api, extractErrorMessages } from "@/lib/api";
import { announcementSchema, type TAnnouncementFormValues } from "../../_types";
import { LANGUAGE_OPTIONS, PRIORITY_OPTIONS } from "../../_constant";

type AnnouncementFormProps = {
  mode: "create" | "edit";
  defaultValues: TAnnouncementFormValues;
  onSubmit: (values: TAnnouncementFormValues) => void | Promise<void>;
  loading?: boolean;
};

export function AnnouncementForm({ mode, defaultValues, onSubmit, loading }: AnnouncementFormProps) {
  const router = useRouter();
  const { FormInput, FormTextarea, FormSelect, FormCheckbox, FormDatePicker } = useFormFields<TAnnouncementFormValues>();

  return (
    <FormWrapper<TAnnouncementFormValues>
      schema={announcementSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-5"
    >
      <FormInput name="title" label="Title" placeholder="Pool closed Saturday for repairs" required autoFocus />

      <FormTextarea
        name="body"
        label="Body"
        placeholder="Hi neighbors — the pool will be closed Saturday 8 AM to 2 PM for routine pump maintenance."
        rows={8}
        required
        hint="Markdown is supported."
      />

      <DraftWithAi />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect name="priority" label="Priority" options={PRIORITY_OPTIONS} hint="Critical announcements bypass resident email opt-outs." />
        <FormSelect name="sourceLanguage" label="Source language" options={LANGUAGE_OPTIONS} hint="Translations are added after publishing." />
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-border bg-surface-2 p-4">
        <FormCheckbox name="isPinned">Pin to the top of the feed</FormCheckbox>
        <FormDatePicker
          name="pinnedUntil"
          label="Auto-unpin date (optional)"
          placeholder="Pick a date"
          hint="If set, the announcement is automatically unpinned at midnight in the HOA timezone."
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-foreground-muted">
        <AlertTriangle size={14} />
        <span>Review carefully — Critical announcements always send.</span>
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/announcements")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Publish" : "Save changes"}
        </Button>
      </div>
    </FormWrapper>
  );
}

function DraftWithAi() {
  const form = useFormContext<TAnnouncementFormValues>();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDraft() {
    if (!prompt.trim()) {
      toast.info("Type a quick note first", "e.g. 'pool closed sat 8a-2p for repairs'");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<{ title: string; body: string; stubbed?: boolean }>("/ai/draft", {
        prompt,
        tone: "friendly",
        length: "standard",
      });
      form.setValue("title", res.data.title, { shouldValidate: true });
      form.setValue("body", res.data.body, { shouldValidate: true });
      toast.success(
        res.data.stubbed ? "Draft inserted (stub mode)" : "Draft inserted",
        res.data.stubbed ? "Set ANTHROPIC_API_KEY to use the real model." : "Review and edit before publishing.",
      );
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't draft", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-surface-2 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Sparkles size={14} className="text-primary" /> Draft with AI
      </div>
      <p className="text-xs text-foreground-muted">
        Type a short note, then click Draft. Always review before publishing.
      </p>
      <div className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="pool closed sat 8a-2p for repairs"
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={handleDraft} loading={loading}>
          Draft
        </Button>
      </div>
    </div>
  );
}
