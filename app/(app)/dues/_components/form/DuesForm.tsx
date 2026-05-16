"use client";

import { useRouter } from "next/navigation";
import { Button, FormWrapper, useFormFields } from "@/components/ds";
import { duesSchema, type TDuesFormValues } from "../../_types";

type DuesFormProps = {
  mode: "create" | "edit";
  defaultValues: TDuesFormValues;
  onSubmit: (values: TDuesFormValues) => void | Promise<void>;
  loading?: boolean;
};

export function DuesForm({ mode, defaultValues, onSubmit, loading }: DuesFormProps) {
  const router = useRouter();
  const { FormInput, FormTextarea, FormDatePicker } = useFormFields<TDuesFormValues>();

  return (
    <FormWrapper<TDuesFormValues>
      schema={duesSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-5"
    >
      <FormInput
        name="unitId"
        label="Unit ID"
        placeholder="UUID of the unit"
        required
        hint="Async unit picker arrives with the relations migration."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="period"
          label="Period"
          placeholder="2026-05"
          required
          hint="YYYY-MM. Use the cycle this due belongs to."
        />
        <FormDatePicker
          name="dueDate"
          label="Due date"
          placeholder="Pick the due date"
          required
        />
      </div>

      <FormInput
        name="amountCents"
        label="Amount (cents)"
        type="number"
        min={0}
        step={1}
        required
        hint="$120.00 = 12000 cents."
      />

      <FormTextarea name="notes" label="Notes" rows={3} placeholder="Optional internal notes" />

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/dues")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create" : "Save changes"}
        </Button>
      </div>
    </FormWrapper>
  );
}
