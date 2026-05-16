"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper, Skeleton, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { MaintenanceForm } from "../../_components/form/MaintenanceForm";
import { useMaintenanceRequest, useUpdateMaintenanceRequest } from "../../_hooks/api";
import type { TMaintenanceFormValues } from "../../_types";

export default function EditMaintenanceRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useMaintenanceRequest(id);
  const update = useUpdateMaintenanceRequest(id);

  const req = data?.result;

  async function handleSubmit(values: TMaintenanceFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Request updated");
      router.push(`/maintenance-requests/${id}`);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't save", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title="Edit request" breadcrumbs={[]}>
        <Skeleton className="h-40 w-full" />
      </PageWrapper>
    );
  }

  if (isError || !req) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <p className="text-sm text-foreground-muted">This request may have been deleted.</p>
      </PageWrapper>
    );
  }

  const defaultValues: TMaintenanceFormValues = {
    title: req.title,
    description: req.description,
    category: req.category,
    unitId: req.unitId,
    photoUrl: req.photoUrl,
  };

  return (
    <PageWrapper
      title="Edit request"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Maintenance", href: "/maintenance-requests" },
        { label: req.title, href: `/maintenance-requests/${id}` },
        { label: "Edit" },
      ]}
    >
      <div className="max-w-2xl">
        <MaintenanceForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={update.isPending}
        />
      </div>
    </PageWrapper>
  );
}
