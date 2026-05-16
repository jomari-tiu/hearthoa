"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Mail } from "lucide-react";
import { PageWrapper, Card, CardBody, Button, Badge, Dialog, Skeleton, toast } from "@/components/ds";
import { formatDate, initials } from "@/lib/format";
import { extractErrorMessages } from "@/lib/api";
import { useBoardMember, useDeleteBoardMember } from "../_hooks/api";

export default function BoardMemberDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useBoardMember(id);
  const del = useDeleteBoardMember(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const m = data?.result;

  async function handleDelete() {
    try {
      await del.mutateAsync(undefined);
      toast.success("Removed from board");
      router.push("/board-members");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't remove", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title={<Skeleton className="h-7 w-64" />} breadcrumbs={[]}>
        <Card><CardBody><Skeleton className="h-32 w-full" /></CardBody></Card>
      </PageWrapper>
    );
  }
  if (isError || !m) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <Button asChild variant="outline"><Link href="/board-members">Back</Link></Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={m.name}
      subtitle={m.role}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Board", href: "/board-members" },
        { label: m.name },
      ]}
      action={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" leftIcon={<Pencil size={14} />}>
            <Link href={`/board-members/${m.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => setConfirmOpen(true)}>
            Remove
          </Button>
        </div>
      }
    >
      <Card>
        <CardBody className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 shrink-0 rounded-full bg-primary-soft text-primary-soft-fg inline-flex items-center justify-center font-bold text-2xl">
            {initials(m.name)}
          </div>
          <div className="flex flex-col gap-2">
            <Badge tone="primary" variant="soft">{m.role}</Badge>
            {m.email ? (
              <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Mail size={14} /> {m.email}
              </a>
            ) : null}
            {m.termEnd ? (
              <span className="text-xs text-foreground-muted">Term ends {formatDate(m.termEnd)}</span>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remove board member"
        description="Removes this person from the public board directory. Their account is unchanged."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={del.isPending}>Cancel</Button>
            <Button variant="danger" loading={del.isPending} onClick={handleDelete}>Remove</Button>
          </>
        }
      />
    </PageWrapper>
  );
}
