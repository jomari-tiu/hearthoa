"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { BoardMemberForm } from "../_components/form/BoardMemberForm";
import { INIT_BOARD_MEMBER } from "../_constant";
import { useCreateBoardMember } from "../_hooks/api";
import type { TBoardMemberFormValues } from "../_types";

export default function CreateBoardMemberPage() {
  const router = useRouter();
  const create = useCreateBoardMember();

  async function handleSubmit(values: TBoardMemberFormValues) {
    try {
      await create.mutateAsync(values);
      toast.success("Board member added");
      router.push("/board-members");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't add", message);
    }
  }

  return (
    <PageWrapper
      title="Add board member"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Board", href: "/board-members" },
        { label: "Add" },
      ]}
    >
      <div className="max-w-2xl">
        <BoardMemberForm
          mode="create"
          defaultValues={INIT_BOARD_MEMBER}
          onSubmit={handleSubmit}
          loading={create.isPending}
        />
      </div>
    </PageWrapper>
  );
}
