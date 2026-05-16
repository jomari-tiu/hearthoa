"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { AnnouncementForm } from "../_components/form/AnnouncementForm";
import { INIT_ANNOUNCEMENT } from "../_constant";
import { useCreateAnnouncement } from "../_hooks/api";
import type { TAnnouncementFormValues } from "../_types";

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const create = useCreateAnnouncement();

  async function handleSubmit(values: TAnnouncementFormValues) {
    try {
      await create.mutateAsync(values);
      toast.success("Announcement published");
      router.push("/announcements");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't publish", message);
    }
  }

  return (
    <PageWrapper
      title="New announcement"
      subtitle="Reaches every resident's dashboard and inbox."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Announcements", href: "/announcements" },
        { label: "Create" },
      ]}
    >
      <div className="max-w-3xl">
        <AnnouncementForm
          mode="create"
          defaultValues={INIT_ANNOUNCEMENT}
          onSubmit={handleSubmit}
          loading={create.isPending}
        />
      </div>
    </PageWrapper>
  );
}
