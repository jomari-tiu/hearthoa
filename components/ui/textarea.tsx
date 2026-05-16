import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-border-strong bg-surface px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle outline-none transition-colors resize-y",
        "focus:border-primary focus:ring-4 focus:ring-[color:var(--primary-ring)]",
        "disabled:opacity-70 disabled:cursor-not-allowed",
        "aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
});

export { Textarea };
