"use client";

import * as React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DatePickerProps = {
  /** YYYY-MM-DD or null. */
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
  fromDate?: Date;
  toDate?: Date;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  invalid,
  disabled,
  className,
  clearable = true,
  fromDate,
  toDate,
}: DatePickerProps) {
  const date = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;
  const parsed = date && isValid(date) ? date : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-2 w-full bg-surface border rounded-md h-9 px-2.5 text-sm outline-none transition-colors",
            "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-[color:var(--primary-ring)]",
            invalid ? "border-danger" : "border-border-strong",
            disabled && "bg-surface-2 opacity-70 cursor-not-allowed",
            !parsed && "text-foreground-subtle",
            parsed && "text-foreground",
            className,
          )}
          data-invalid={invalid || undefined}
        >
          <CalendarIcon size={14} className="text-foreground-subtle shrink-0" />
          <span className="flex-1 text-left">
            {parsed ? format(parsed, "PPP") : placeholder}
          </span>
          {clearable && parsed ? (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear date"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="text-foreground-subtle hover:text-foreground"
            >
              <X size={12} />
            </span>
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsed}
          onSelect={(d) => onChange(d ? format(d, "yyyy-MM-dd") : null)}
          autoFocus
          startMonth={fromDate}
          endMonth={toDate}
        />
      </PopoverContent>
    </Popover>
  );
}
