"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button, Card, CardBody, FormWrapper, useFormFields, toast } from "@/components/ds";
import { api, extractErrorMessages } from "@/lib/api";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string().min(8),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords must match" });

type Values = z.infer<typeof schema>;

const INIT: Values = { password: "", confirm: "" };

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [loading, setLoading] = useState(false);
  const { FormInput } = useFormFields<Values>();

  async function handleSubmit(values: Values) {
    if (!token) {
      toast.error("Missing reset link", "Use the link from your email.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password: values.password });
      toast.success("Password updated", "You can sign in with your new password.");
      router.push("/");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't reset password", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <FormWrapper<Values> schema={schema} defaultValues={INIT} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput name="password" label="New password" type="password" required />
          <FormInput name="confirm" label="Confirm password" type="password" required />
          <Button type="submit" loading={loading} className="w-full">
            Update password
          </Button>
        </FormWrapper>
      </CardBody>
    </Card>
  );
}
