import * as React from "react";
import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(function Table({ className, ...props }, ref) {
  return (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
});

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} className={cn("bg-surface-2 text-foreground-muted [&_tr]:border-b [&_tr]:border-border", className)} {...props} />;
});

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} className={cn("[&_tr]:border-t [&_tr]:border-border", className)} {...props} />;
});

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(function TableRow({ className, ...props }, ref) {
  return <tr ref={ref} className={cn("transition-colors hover:bg-surface-hover data-[state=selected]:bg-surface-hover", className)} {...props} />;
});

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(function TableHead({ className, ...props }, ref) {
  return <th ref={ref} className={cn("h-9 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wide", className)} {...props} />;
});

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(function TableCell({ className, ...props }, ref) {
  return <td ref={ref} className={cn("px-4 py-3 align-middle text-foreground", className)} {...props} />;
});

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(function TableCaption({ className, ...props }, ref) {
  return <caption ref={ref} className={cn("mt-4 text-sm text-foreground-muted", className)} {...props} />;
});

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption };
