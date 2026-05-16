"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { MaintenanceForm } from "../_components/form/MaintenanceForm";
import { INIT_MAINTENANCE } from "../_constant";
import { useCreateMaintenanceRequest } from "../_hooks/api";
import type { TMaintenanceFormValues } from "../_types";

export default function CreateMaintenanceRequestPage() {
  const router = useRouter();
  const create = useCreateMaintenanceRequest();

  async function handleSubmit(values: TMaintenanceFormValues) {
    try {
      await create.mutateAsync(values);
      toast.success("Request submitted", "The board will follow up by email.");
      router.push("/maintenance-requests");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't submit", message);
    }
  }

  return (
    <PageWrapper
      title="Submit a maintenance request"
      subtitle="For common-area issues. Inside-the-unit work goes to your own contractor."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Maintenance", href: "/maintenance-requests" },
        { label: "Submit" },
      ]}
    >
      <div className="max-w-2xl">
        <MaintenanceForm
          mode="create"
          defaultValues={INIT_MAINTENANCE}
          onSubmit={handleSubmit}
          loading={create.isPending}
        />
      </div>
    </PageWrapper>
  );
}
