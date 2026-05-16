"use client";

import { Controller, useFormContext, type FieldError, type FieldValues, type Path } from "react-hook-form";
import { type ReactNode } from "react";
import { Input, type InputProps } from "./Input";
import { Textarea, type TextareaProps } from "./Textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

type FieldShellProps = {
  htmlFor?: string;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  error?: FieldError | undefined;
  children: ReactNode;
  className?: string;
};

function FieldShell({ htmlFor, label, hint, required, error, children, className }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
      {label ? (
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="text-danger ml-0.5">*</span> : null}
        </Label>
      ) : null}
      {children}
      {error?.message ? (
        <p className="text-xs text-danger">{error.message}</p>
      ) : hint ? (
        <p className="text-xs text-foreground-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

export type SelectOption = { label: string; value: string };
export type AsyncSearchResult = { items: SelectOption[]; hasMore: boolean };

type CommonFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: ReactNode;
  hint?: ReactNode;
  required?: boolean;
  className?: string;
};

export function useFormFields<T extends FieldValues>() {
  function fieldId(name: Path<T>): string {
    return `f-${String(name).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  }

  function FormInput(props: CommonFieldProps<T> & Omit<InputProps, "name" | "value" | "onChange">) {
    const { name, label, hint, required, className, ...inputProps } = props;
    const ctx = useFormContext<T>();
    const error = ctx.formState.errors[name] as FieldError | undefined;
    const id = fieldId(name);
    return (
      <FieldShell htmlFor={id} label={label} hint={hint} required={required} error={error} className={className}>
        <Input id={id} invalid={Boolean(error)} {...inputProps} {...ctx.register(name)} />
      </FieldShell>
    );
  }

  function FormTextarea(props: CommonFieldProps<T> & Omit<TextareaProps, "name" | "value" | "onChange">) {
    const { name, label, hint, required, className, ...textareaProps } = props;
    const ctx = useFormContext<T>();
    const error = ctx.formState.errors[name] as FieldError | undefined;
    const id = fieldId(name);
    return (
      <FieldShell htmlFor={id} label={label} hint={hint} required={required} error={error} className={className}>
        <Textarea id={id} invalid={Boolean(error)} {...textareaProps} {...ctx.register(name)} />
      </FieldShell>
    );
  }

  function FormSelect(
    props: CommonFieldProps<T> & { options: SelectOption[]; placeholder?: string; disabled?: boolean },
  ) {
    const { name, label, hint, required, className, options, placeholder, disabled } = props;
    const ctx = useFormContext<T>();
    const error = ctx.formState.errors[name] as FieldError | undefined;
    const id = fieldId(name);
    return (
      <FieldShell htmlFor={id} label={label} hint={hint} required={required} error={error} className={className}>
        <Controller
          control={ctx.control}
          name={name}
          render={({ field }) => (
            <Select
              value={(field.value as string) ?? ""}
              onValueChange={(v) => field.onChange(v)}
              disabled={disabled}
            >
              <SelectTrigger id={id} aria-invalid={Boolean(error) || undefined} className={error ? "border-danger" : undefined}>
                <SelectValue placeholder={placeholder ?? "Select…"} />
              </SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FieldShell>
    );
  }

  function FormDatePicker(
    props: CommonFieldProps<T> & { placeholder?: string; disabled?: boolean; clearable?: boolean },
  ) {
    const { name, label, hint, required, className, placeholder, disabled, clearable } = props;
    const ctx = useFormContext<T>();
    const error = ctx.formState.errors[name] as FieldError | undefined;
    return (
      <FieldShell label={label} hint={hint} required={required} error={error} className={className}>
        <Controller
          control={ctx.control}
          name={name}
          render={({ field }) => (
            <DatePicker
              value={(field.value as string | null) ?? null}
              onChange={(v) => field.onChange(v)}
              placeholder={placeholder}
              invalid={Boolean(error)}
              disabled={disabled}
              clearable={clearable}
            />
          )}
        />
      </FieldShell>
    );
  }

  function FormCheckbox(props: CommonFieldProps<T> & { children: ReactNode }) {
    const { name, hint, className, children } = props;
    const ctx = useFormContext<T>();
    const error = ctx.formState.errors[name] as FieldError | undefined;
    const id = fieldId(name);
    return (
      <Controller
        control={ctx.control}
        name={name}
        render={({ field }) => (
          <div className={cn("flex items-start gap-2", className)}>
            <Checkbox
              id={id}
              checked={Boolean(field.value)}
              onCheckedChange={(v) => field.onChange(v === true)}
            />
            <label htmlFor={id} className="flex flex-col gap-0.5 cursor-pointer leading-snug">
              <span className="text-sm font-medium text-foreground">{children}</span>
              {hint ? <span className="text-xs text-foreground-subtle">{hint}</span> : null}
              {error?.message ? <span className="text-xs text-danger">{error.message}</span> : null}
            </label>
          </div>
        )}
      />
    );
  }

  return { FormInput, FormTextarea, FormSelect, FormDatePicker, FormCheckbox };
}
