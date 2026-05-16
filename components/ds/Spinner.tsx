import { cn } from "@/lib/utils";

export function Spinner({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block border-2 border-border-strong border-t-primary rounded-full animate-spin",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
