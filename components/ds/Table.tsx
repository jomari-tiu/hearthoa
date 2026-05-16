"use client";

import { type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table as UITable,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";
import { cn } from "@/lib/utils";

export type TableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  className?: string;
  width?: string;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[] | undefined;
  rowKey: keyof T | ((row: T) => string);
  loading?: boolean;
  emptyMessage?: ReactNode;
  onRowClick?: (row: T) => void;
  pagination?: boolean;
  pageSize?: number;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

export function Table<T>({
  columns,
  data,
  rowKey,
  loading,
  emptyMessage = "No records",
  onRowClick,
  pagination,
  pageSize = 10,
  totalCount = 0,
  currentPage = 1,
  onPageChange,
}: TableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const getKey = (row: T): string => (typeof rowKey === "function" ? rowKey(row) : String(row[rowKey]));

  return (
    <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
      <UITable>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={c.className} style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    <Skeleton className="h-4 w-3/4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : !data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-foreground-muted py-12">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={getKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((c) => (
                  <TableCell key={c.key} className={c.className}>
                    {c.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </UITable>
      {pagination ? (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-surface-2 text-xs text-foreground-muted">
          <span>
            Page {currentPage} of {totalPages} · {totalCount} total
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
