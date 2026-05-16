"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import {
  PageWrapper,
  Card,
  CardBody,
  Button,
  Badge,
  Dialog,
  Skeleton,
  toast,
} from "@/components/ds";
import { formatDateTime } from "@/lib/format";
import { extractErrorMessages } from "@/lib/api";
import { useAnnouncement, useDeleteAnnouncement } from "../_hooks/api";

export default function AnnouncementDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useAnnouncement(id);
  const del = useDeleteAnnouncement(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const announcement = data?.result;

  async function handleDelete() {
    try {
      await del.mutateAsync(undefined);
      toast.success("Announcement deleted");
      router.push("/announcements");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't delete", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title={<Skeleton className="h-7 w-80" />} breadcrumbs={[]}>
        <Card>
          <CardBody className="flex flex-col gap-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </CardBody>
        </Card>
      </PageWrapper>
    );
  }

  if (isError || !announcement) {
    return (
      <PageWrapper
        title="Not found"
        subtitle="This announcement may have been deleted or you may not have access."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Announcements", href: "/announcements" },
        ]}
      >
        <Button asChild variant="outline">
          <Link href="/announcements">Back to announcements</Link>
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={announcement.title}
      subtitle={announcement.publishedAt ? `Published ${formatDateTime(announcement.publishedAt)}` : "Draft"}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Announcements", href: "/announcements" },
        { label: announcement.title },
      ]}
      action={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" leftIcon={<Pencil size={14} />}>
            <Link href={`/announcements/${announcement.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 size={14} />}
            onClick={() => setConfirmOpen(true)}
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {announcement.priority === "critical" ? (
                <Badge tone="danger" variant="soft">Critical</Badge>
              ) : (
                <Badge tone="neutral" variant="soft">General</Badge>
              )}
              {announcement.isPinned ? <Badge tone="primary" variant="soft">Pinned</Badge> : null}
              <Badge tone="info" variant="outline">{announcement.sourceLanguage.toUpperCase()}</Badge>
            </div>
            <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
              {announcement.body}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col gap-3 text-sm">
            <DetailRow label="Author" value={announcement.author?.name ?? "—"} />
            <DetailRow label="Created" value={formatDateTime(announcement.createdAt)} />
            <DetailRow label="Last updated" value={formatDateTime(announcement.updatedAt)} />
            {announcement.pinnedUntil ? (
              <DetailRow label="Auto-unpins" value={formatDateTime(announcement.pinnedUntil)} />
            ) : null}
            {announcement.scheduledFor ? (
              <DetailRow label="Scheduled for" value={formatDateTime(announcement.scheduledFor)} />
            ) : null}
          </CardBody>
        </Card>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete announcement"
        description="This is permanent. Translations are deleted too. Residents who already received the email keep their copy."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={del.isPending}>
              Cancel
            </Button>
            <Button variant="danger" loading={del.isPending} onClick={handleDelete}>
              Delete announcement
            </Button>
          </>
        }
      />
    </PageWrapper>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-foreground-subtle">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
