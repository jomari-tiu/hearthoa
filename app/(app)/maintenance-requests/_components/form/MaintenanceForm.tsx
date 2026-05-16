"use client";

import { useRouter } from "next/navigation";
import { Button, FormWrapper, useFormFields } from "@/components/ds";
import { maintenanceSchema, type TMaintenanceFormValues } from "../../_types";
import { CATEGORY_OPTIONS } from "../../_constant";

type MaintenanceFormProps = {
  mode: "create" | "edit";
  defaultValues: TMaintenanceFormValues;
  onSubmit: (values: TMaintenanceFormValues) => void | Promise<void>;
  loading?: boolean;
};

export function MaintenanceForm({ mode, defaultValues, onSubmit, loading }: MaintenanceFormProps) {
  const router = useRouter();
  const { FormInput, FormTextarea, FormSelect } = useFormFields<TMaintenanceFormValues>();

  return (
    <FormWrapper<TMaintenanceFormValues>
      schema={maintenanceSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-5"
    >
      <FormInput name="title" label="What needs attention?" placeholder="Broken sprinkler in section C" required />

      <FormTextarea
        name="description"
        label="Details"
        rows={6}
        placeholder="Sprinkler near the southwest corner is spraying onto the sidewalk."
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect name="category" label="Category" options={CATEGORY_OPTIONS} />
        <FormInput name="unitId" label="Unit ID" placeholder="Your unit UUID" required />
      </div>

      <FormInput
        name="photoUrl"
        label="Photo URL (optional)"
        placeholder="Will be replaced with a direct uploader in Sprint 4."
      />

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/maintenance-requests")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Submit request" : "Save changes"}
        </Button>
      </div>
    </FormWrapper>
  );
}
