"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { Button, FormWrapper, useFormFields, toast, Card, CardBody } from "@/components/ds";
import { loginRequest } from "@/lib/auth";
import { extractErrorMessages } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type TLoginFormValues = z.infer<typeof loginSchema>;

const INIT_LOGIN: TLoginFormValues = { email: "", password: "" };

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { FormInput } = useFormFields<TLoginFormValues>();

  async function handleSubmit(values: TLoginFormValues) {
    setLoading(true);
    try {
      const user = await loginRequest(values.email, values.password);
      toast.success("Welcome back", user.name);
      router.push(search.get("next") ?? "/dashboard");
      router.refresh();
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Sign-in failed", message ?? "Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardBody>
        <FormWrapper<TLoginFormValues>
          schema={loginSchema}
          defaultValues={INIT_LOGIN}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <FormInput name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
          <FormInput name="password" label="Password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </FormWrapper>
      </CardBody>
    </Card>
  );
}
