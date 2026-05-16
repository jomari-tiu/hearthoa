import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

type PageWrapperProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumbs?: Crumb[];
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PageWrapper({ title, subtitle, breadcrumbs, action, children, className }: PageWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-6 p-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-foreground-subtle">
          {breadcrumbs.map((c, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={`${c.label}-${i}`} className="inline-flex items-center gap-1.5">
                {c.href && !isLast ? (
                  <Link href={c.href} className="hover:text-foreground transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className={cn(isLast && "text-foreground-muted font-medium")}>{c.label}</span>
                )}
                {!isLast ? <ChevronRight size={12} className="text-foreground-subtle" /> : null}
              </span>
            );
          })}
        </nav>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p> : null}
        </div>
        {action ? <div className="flex-shrink-0">{action}</div> : null}
      </div>

      {children}
    </div>
  );
}
