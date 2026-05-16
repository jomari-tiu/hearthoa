import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-xs font-semibold capitalize whitespace-nowrap transition-colors",
  {
    variants: {
      tone: {
        neutral: "",
        primary: "",
        success: "",
        warning: "",
        danger: "",
        info: "",
      },
      variant: { soft: "", solid: "", outline: "" },
    },
    compoundVariants: [
      { tone: "neutral", variant: "soft", className: "bg-surface-2 text-foreground-muted border border-border" },
      { tone: "neutral", variant: "solid", className: "bg-foreground text-[var(--bg)]" },
      { tone: "neutral", variant: "outline", className: "bg-transparent text-foreground-muted border border-border-strong" },
      { tone: "primary", variant: "soft", className: "bg-primary-soft text-primary-soft-fg" },
      { tone: "primary", variant: "solid", className: "bg-primary text-primary-fg" },
      { tone: "primary", variant: "outline", className: "bg-transparent text-primary border border-primary" },
      { tone: "success", variant: "soft", className: "bg-success-soft text-success-soft-fg" },
      { tone: "success", variant: "solid", className: "bg-success text-white" },
      { tone: "success", variant: "outline", className: "bg-transparent text-success border border-success" },
      { tone: "warning", variant: "soft", className: "bg-warning-soft text-warning-soft-fg" },
      { tone: "warning", variant: "solid", className: "bg-warning text-[oklch(18%_0.04_75)]" },
      { tone: "warning", variant: "outline", className: "bg-transparent text-warning border border-warning" },
      { tone: "danger", variant: "soft", className: "bg-danger-soft text-danger-soft-fg" },
      { tone: "danger", variant: "solid", className: "bg-danger text-white" },
      { tone: "danger", variant: "outline", className: "bg-transparent text-danger border border-danger" },
      { tone: "info", variant: "soft", className: "bg-info-soft text-info-soft-fg" },
      { tone: "info", variant: "solid", className: "bg-info text-white" },
      { tone: "info", variant: "outline", className: "bg-transparent text-info border border-info" },
    ],
    defaultVariants: { tone: "neutral", variant: "soft" },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

function Badge({ className, tone, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
