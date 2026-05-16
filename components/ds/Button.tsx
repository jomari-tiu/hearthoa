"use client";

import * as React from "react";
import { Button as UIButton, type ButtonProps as UIButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ButtonProps = Omit<UIButtonProps, "children"> & {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { loading = false, leftIcon, rightIcon, disabled, asChild, children, className, ...rest },
  ref,
) {
  if (asChild) {
    return (
      <UIButton ref={ref} asChild className={className} {...rest}>
        {children}
      </UIButton>
    );
  }

  return (
    <UIButton
      ref={ref}
      className={cn(className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden
          className="w-3 h-3 border-[1.6px] border-current border-t-transparent rounded-full animate-spin"
        />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </UIButton>
  );
});
