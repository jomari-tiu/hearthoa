"use client";

import * as React from "react";
import { Input as UIInput, type InputProps as UIInputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type InputProps = Omit<UIInputProps, "size"> & {
  invalid?: boolean;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASS = { sm: "h-7 text-xs", md: "h-9", lg: "h-11" } as const;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, leftIcon, rightSlot, className, size = "md", ...rest },
  ref,
) {
  if (!leftIcon && !rightSlot) {
    return (
      <UIInput
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(SIZE_CLASS[size], invalid && "border-danger", className)}
        {...rest}
      />
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 w-full bg-surface border rounded-md px-2.5 transition-colors",
        "focus-within:border-primary focus-within:ring-4 focus-within:ring-[color:var(--primary-ring)]",
        invalid ? "border-danger" : "border-border-strong",
        SIZE_CLASS[size],
        className,
      )}
    >
      {leftIcon ? <span className="text-foreground-subtle shrink-0">{leftIcon}</span> : null}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className="flex-1 min-w-0 bg-transparent outline-none border-0 p-0 text-foreground placeholder:text-foreground-subtle disabled:cursor-not-allowed"
        {...rest}
      />
      {rightSlot ? <span className="text-foreground-subtle shrink-0">{rightSlot}</span> : null}
    </div>
  );
});
