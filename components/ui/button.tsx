"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-semibold outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-4 focus-visible:ring-[color:var(--primary-ring)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-fg border border-primary hover:bg-primary-hover hover:border-primary-hover active:bg-primary-active",
        secondary: "bg-surface text-foreground border border-border-strong hover:bg-surface-hover",
        outline: "bg-transparent text-foreground border border-border-strong hover:border-foreground-muted hover:bg-surface-hover",
        ghost: "bg-transparent text-foreground border border-transparent hover:bg-surface-hover",
        soft: "bg-primary-soft text-primary-soft-fg border border-transparent hover:brightness-95",
        danger: "bg-danger text-white border border-danger hover:bg-danger-hover",
        link: "bg-transparent text-primary p-0 h-auto border-0 hover:underline rounded-none",
      },
      size: {
        sm: "h-7 px-2.5 text-xs",
        md: "h-9 px-3",
        lg: "h-11 px-4",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild = false, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

export { Button, buttonVariants };
