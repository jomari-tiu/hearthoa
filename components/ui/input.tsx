import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({ className, type, ...props }, ref) {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-9 w-full rounded-md border border-border-strong bg-surface px-2.5 text-sm text-foreground placeholder:text-foreground-subtle outline-none transition-colors",
        "focus:border-primary focus:ring-4 focus:ring-[color:var(--primary-ring)]",
        "disabled:bg-surface-2 disabled:opacity-70 disabled:cursor-not-allowed",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
});

export { Input };
