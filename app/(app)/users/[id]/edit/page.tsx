"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper, Skeleton, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { UserForm } from "../../_components/form/UserForm";
import { useUser, useUpdateUser } from "../../_hooks/api";
import type { TUserEditValues } from "../../_types";

export default function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useUser(id);
  const update = useUpdateUser(id);

  const user = data?.result;

  async function handleSubmit(values: TUserEditValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Saved");
      router.push(`/users/${id}`);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't save", message);
    }
  }

  if (isLoading) return <PageWrapper title="Edit user" breadcrumbs={[]}><Skeleton className="h-40 w-full" /></PageWrapper>;
  if (isError || !user) return <PageWrapper title="Not found" breadcrumbs={[]}><p className="text-sm text-foreground-muted">This user may have been removed.</p></PageWrapper>;

  const defaultValues: TUserEditValues = {
    name: user.name,
    phone: user.phone,
    role: user.role,
    status: user.status,
    preferredLanguage: user.preferredLanguage,
  };

  return (
    <PageWrapper
      title="Edit user"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Users", href: "/users" },
        { label: user.name, href: `/users/${id}` },
        { label: "Edit" },
      ]}
    >
      <div className="max-w-2xl">
        <UserForm mode="edit" defaultValues={defaultValues} onSubmit={handleSubmit} loading={update.isPending} />
      </div>
    </PageWrapper>
  );
}
