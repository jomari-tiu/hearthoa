"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper, Skeleton, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { DuesForm } from "../../_components/form/DuesForm";
import { useDue, useUpdateDue } from "../../_hooks/api";
import type { TDuesFormValues } from "../../_types";

export default function EditDuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useDue(id);
  const update = useUpdateDue(id);

  const due = data?.result;

  async function handleSubmit(values: TDuesFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Due updated");
      router.push(`/dues/${id}`);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't save", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title="Edit due" breadcrumbs={[]}>
        <Skeleton className="h-40 w-full" />
      </PageWrapper>
    );
  }

  if (isError || !due) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <p className="text-sm text-foreground-muted">This due may have been deleted.</p>
      </PageWrapper>
    );
  }

  const defaultValues: TDuesFormValues = {
    unitId: due.unitId,
    period: due.period,
    amountCents: due.amountCents,
    dueDate: due.dueDate,
    notes: due.notes ?? "",
  };

  return (
    <PageWrapper
      title="Edit due"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Dues", href: "/dues" },
        { label: due.period, href: `/dues/${id}` },
        { label: "Edit" },
      ]}
    >
      <div className="max-w-2xl">
        <DuesForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={update.isPending}
        />
      </div>
    </PageWrapper>
  );
}
