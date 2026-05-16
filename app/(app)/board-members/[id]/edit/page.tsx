"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper, Skeleton, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { BoardMemberForm } from "../../_components/form/BoardMemberForm";
import { useBoardMember, useUpdateBoardMember } from "../../_hooks/api";
import type { TBoardMemberFormValues } from "../../_types";

export default function EditBoardMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useBoardMember(id);
  const update = useUpdateBoardMember(id);

  const m = data?.result;

  async function handleSubmit(values: TBoardMemberFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Saved");
      router.push(`/board-members/${id}`);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't save", message);
    }
  }

  if (isLoading) return <PageWrapper title="Edit member" breadcrumbs={[]}><Skeleton className="h-40 w-full" /></PageWrapper>;
  if (isError || !m) return <PageWrapper title="Not found" breadcrumbs={[]}><p className="text-sm text-foreground-muted">This member may have been removed.</p></PageWrapper>;

  const defaultValues: TBoardMemberFormValues = {
    name: m.name,
    role: m.role,
    email: m.email,
    photoUrl: m.photoUrl,
    termEnd: m.termEnd,
    displayOrder: m.displayOrder,
  };

  return (
    <PageWrapper
      title="Edit member"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Board", href: "/board-members" },
        { label: m.name, href: `/board-members/${id}` },
        { label: "Edit" },
      ]}
    >
      <div className="max-w-2xl">
        <BoardMemberForm mode="edit" defaultValues={defaultValues} onSubmit={handleSubmit} loading={update.isPending} />
      </div>
    </PageWrapper>
  );
}
