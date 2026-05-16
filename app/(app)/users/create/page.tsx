"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { UserForm } from "../_components/form/UserForm";
import { INIT_USER } from "../_constant";
import { useCreateUser } from "../_hooks/api";
import type { TUserCreateValues } from "../_types";

export default function CreateUserPage() {
  const router = useRouter();
  const create = useCreateUser();

  async function handleSubmit(values: TUserCreateValues) {
    try {
      await create.mutateAsync(values);
      toast.success("User created");
      router.push("/users");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't create user", message);
    }
  }

  return (
    <PageWrapper
      title="New user"
      subtitle="Admins can create users directly without waiting for self-registration."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Users", href: "/users" },
        { label: "Create" },
      ]}
    >
      <div className="max-w-2xl">
        <UserForm mode="create" defaultValues={INIT_USER} onSubmit={handleSubmit} loading={create.isPending} />
      </div>
    </PageWrapper>
  );
}
