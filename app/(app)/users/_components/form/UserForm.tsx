"use client";

import { useRouter } from "next/navigation";
import { Button, FormWrapper, useFormFields } from "@/components/ds";
import { userCreateSchema, userEditSchema, type TUserCreateValues, type TUserEditValues } from "../../_types";
import { LANGUAGE_OPTIONS, ROLE_OPTIONS, STATUS_OPTIONS } from "../../_constant";

type CreateProps = {
  mode: "create";
  defaultValues: TUserCreateValues;
  onSubmit: (values: TUserCreateValues) => void | Promise<void>;
  loading?: boolean;
};

type EditProps = {
  mode: "edit";
  defaultValues: TUserEditValues;
  onSubmit: (values: TUserEditValues) => void | Promise<void>;
  loading?: boolean;
};

export function UserForm(props: CreateProps | EditProps) {
  return props.mode === "create" ? <CreateForm {...props} /> : <EditForm {...props} />;
}

function CreateForm({ defaultValues, onSubmit, loading }: CreateProps) {
  const router = useRouter();
  const { FormInput, FormSelect } = useFormFields<TUserCreateValues>();
  return (
    <FormWrapper<TUserCreateValues>
      schema={userCreateSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="name" label="Name" placeholder="Maya Chen" required />
        <FormInput name="email" label="Email" type="email" placeholder="resident@example.com" required />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="phone" label="Phone (optional)" placeholder="+1 415 555 0123" />
        <FormSelect name="preferredLanguage" label="Preferred language" options={LANGUAGE_OPTIONS} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          name="role"
          label="Role"
          options={ROLE_OPTIONS}
          hint="Resident: read-mostly. Admin: full board access."
        />
        <FormInput
          name="password"
          label="Initial password"
          type="password"
          required
          hint="The user can change it after signing in. Self-serve reset works too."
        />
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/users")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>Create user</Button>
      </div>
    </FormWrapper>
  );
}

function EditForm({ defaultValues, onSubmit, loading }: EditProps) {
  const router = useRouter();
  const { FormInput, FormSelect } = useFormFields<TUserEditValues>();
  return (
    <FormWrapper<TUserEditValues>
      schema={userEditSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput name="name" label="Name" required />
        <FormInput name="phone" label="Phone" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSelect name="role" label="Role" options={ROLE_OPTIONS} />
        <FormSelect name="status" label="Status" options={STATUS_OPTIONS} />
        <FormSelect name="preferredLanguage" label="Preferred language" options={LANGUAGE_OPTIONS} />
      </div>
      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" type="button" onClick={() => router.push("/users")} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>Save changes</Button>
      </div>
    </FormWrapper>
  );
}
