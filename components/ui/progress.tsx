"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  tone?: "primary" | "success" | "warning" | "danger";
};

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, Props>(function Progress(
  { className, value, tone = "primary", ...props },
  ref,
) {
  const fillClass =
    tone === "danger" ? "bg-danger" : tone === "warning" ? "bg-warning" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-1.5 w-full overflow-hidden rounded-pill bg-surface-2", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-transform", fillClass)}
        style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value ?? 0))}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

export { Progress };
