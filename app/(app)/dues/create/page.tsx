"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { DuesForm } from "../_components/form/DuesForm";
import { INIT_DUES } from "../_constant";
import { useCreateDue } from "../_hooks/api";
import type { TDuesFormValues } from "../_types";

export default function CreateDuesPage() {
  const router = useRouter();
  const create = useCreateDue();

  async function handleSubmit(values: TDuesFormValues) {
    try {
      await create.mutateAsync(values);
      toast.success("Due recorded");
      router.push("/dues");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't record due", message);
    }
  }

  return (
    <PageWrapper
      title="Record a due"
      subtitle="Bulk-generate for the cycle arrives with Sprint 5."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Dues", href: "/dues" },
        { label: "Create" },
      ]}
    >
      <div className="max-w-2xl">
        <DuesForm
          mode="create"
          defaultValues={INIT_DUES}
          onSubmit={handleSubmit}
          loading={create.isPending}
        />
      </div>
    </PageWrapper>
  );
}
