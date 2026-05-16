"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button, FormWrapper, useFormFields, Card, CardBody, toast } from "@/components/ds";
import { api, extractErrorMessages } from "@/lib/api";

const schema = z.object({
  hoaSlug: z.string().min(1, "Community code is required"),
  email: z.string().email("Enter a valid email"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(8, "At least 8 characters"),
  unitAddress: z.string().min(1, "Unit address is required"),
  unitNumber: z.string().optional(),
  phone: z.string().optional(),
});

type Values = z.infer<typeof schema>;

const INIT: Values = {
  hoaSlug: "sunset-ridge",
  email: "",
  name: "",
  password: "",
  unitAddress: "",
  unitNumber: "",
  phone: "",
};

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { FormInput } = useFormFields<Values>();

  async function handleSubmit(values: Values) {
    setLoading(true);
    try {
      await api.post("/auth/register", {
        ...values,
        unitNumber: values.unitNumber || null,
        phone: values.phone || null,
      });
      setDone(true);
      toast.success("Submitted", "An admin will approve your account shortly.");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't register", message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Card>
        <CardBody className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-foreground">You&apos;re on the list</h3>
          <p className="text-sm text-foreground-muted">
            We&apos;ve recorded your request. The board will verify your unit and activate your account — you&apos;ll get an email when it&apos;s ready.
          </p>
          <Button variant="outline" onClick={() => router.push("/")}>Back to sign in</Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <FormWrapper<Values> schema={schema} defaultValues={INIT} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormInput name="hoaSlug" label="Community code" placeholder="sunset-ridge" required hint="Provided by your board." />
          <FormInput name="name" label="Full name" placeholder="Maya Chen" required />
          <FormInput name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" required />
          <FormInput name="password" label="Password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required />
          <FormInput name="unitAddress" label="Unit address" placeholder="1024 Sunset Ridge Dr" required />
          <FormInput name="unitNumber" label="Unit number (optional)" placeholder="Suite 3B" />
          <FormInput name="phone" label="Phone (optional)" placeholder="+1 415 555 0123" />
          <Button type="submit" loading={loading} className="w-full">Submit request</Button>
        </FormWrapper>
      </CardBody>
    </Card>
  );
}
