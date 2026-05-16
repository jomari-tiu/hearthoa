"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper, Skeleton, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { AnnouncementForm } from "../../_components/form/AnnouncementForm";
import { useAnnouncement, useUpdateAnnouncement } from "../../_hooks/api";
import type { TAnnouncementFormValues } from "../../_types";

export default function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useAnnouncement(id);
  const update = useUpdateAnnouncement(id);

  const announcement = data?.result;

  async function handleSubmit(values: TAnnouncementFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Announcement updated");
      router.push(`/announcements/${id}`);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't save", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title="Edit announcement" breadcrumbs={[]}>
        <div className="max-w-3xl flex flex-col gap-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </PageWrapper>
    );
  }

  if (isError || !announcement) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <p className="text-sm text-foreground-muted">This announcement may have been deleted.</p>
      </PageWrapper>
    );
  }

  const defaultValues: TAnnouncementFormValues = {
    title: announcement.title,
    body: announcement.body,
    priority: announcement.priority,
    sourceLanguage: announcement.sourceLanguage,
    isPinned: announcement.isPinned,
    pinnedUntil: announcement.pinnedUntil,
  };

  return (
    <PageWrapper
      title="Edit announcement"
      subtitle="Changes apply to the canonical version only. Translations require re-running translate."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Announcements", href: "/announcements" },
        { label: announcement.title, href: `/announcements/${id}` },
        { label: "Edit" },
      ]}
    >
      <div className="max-w-3xl">
        <AnnouncementForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={update.isPending}
        />
      </div>
    </PageWrapper>
  );
}
