"use client";

import { type ReactNode } from "react";
import { FormProvider, useForm, type DefaultValues, type FieldValues, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodTypeAny } from "zod";
import { cn } from "@/lib/utils";

type FormWrapperProps<T extends FieldValues> = {
  schema: ZodTypeAny;
  defaultValues: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  children: ReactNode;
  className?: string;
};

export function FormWrapper<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: FormWrapperProps<T>) {
  const methods = useForm<T>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={cn("flex flex-col gap-5", className)} noValidate>
        {children}
      </form>
    </FormProvider>
  );
}
