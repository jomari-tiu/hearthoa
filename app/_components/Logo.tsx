import { cn } from "@/lib/utils";

export function Logo({ className, withText = true }: { className?: string; withText?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-fg font-bold text-sm shadow-sm"
      >
        H
      </span>
      {withText ? (
        <span className="font-semibold tracking-tight text-foreground">
          Hearth<span className="text-primary">HOA</span>
        </span>
      ) : null}
    </span>
  );
}
