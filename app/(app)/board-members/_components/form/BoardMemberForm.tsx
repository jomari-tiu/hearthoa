"use client";

import { useRouter } from "next/navigation";
import { Button, FormWrapper, useFormFields } from "@/components/ds";
import { boardMemberSchema, type TBoardMemberFormValues } from "../../_types";

type BoardMemberFormProps = {
  mode: "create" | "edit";
  defaultValues: TBoardMemberFormValues;
  onSubmit: (values: TBoardMemberFormValues) => void | Promise<void>;
  loading?: boolean;
};

export function BoardMemberForm({ mode, defaultValues, onSubmit, loading }: BoardMemberFormProps) {
  const router = useRouter();
  const { FormInput, FormDatePicker } = useFormFields<TBoardMemberFormValues>();

  return (
    <FormWrapper<TBoardMemberFormValues>
      schema={boardMemberSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="name" label="Name" placeholder="Jordan Pérez" required />
        <FormInput name="role" label="Role" placeholder="President" required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="email" label="Contact email" type="email" placeholder="board@example.com" />
        <FormDatePicker name="termEnd" label="Term end" placeholder="Pick a date" />
      </div>

      <FormInput name="photoUrl" label="Photo URL" placeholder="Direct uploader arrives later" />
      <FormInput name="displayOrder" label="Display order" type="number" step={1} />

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/board-members")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Add member" : "Save changes"}
        </Button>
      </div>
    </FormWrapper>
  );
}
