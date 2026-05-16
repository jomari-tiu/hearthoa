"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-3 relative",
        month: "flex flex-col gap-3",
        month_caption: "flex justify-center pt-0.5 relative items-center text-sm font-semibold text-foreground",
        nav: "flex items-center gap-1",
        button_previous: "absolute left-1 top-1 inline-flex items-center justify-center h-7 w-7 rounded-md text-foreground-muted hover:bg-surface-hover transition-colors",
        button_next: "absolute right-1 top-1 inline-flex items-center justify-center h-7 w-7 rounded-md text-foreground-muted hover:bg-surface-hover transition-colors",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "text-foreground-subtle font-medium text-[11px] uppercase tracking-wide w-9 text-center",
        week: "flex w-full mt-1",
        day: "h-9 w-9 text-center p-0 relative align-middle text-sm",
        day_button:
          "inline-flex items-center justify-center h-9 w-9 rounded-md font-normal text-foreground hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary-ring)]",
        selected: "[&_button]:bg-primary [&_button]:text-primary-fg [&_button]:hover:bg-primary-hover",
        today: "[&_button]:font-semibold [&_button]:text-primary",
        outside: "[&_button]:text-foreground-subtle [&_button]:opacity-60",
        disabled: "[&_button]:text-foreground-subtle [&_button]:opacity-40 [&_button]:cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: (props) =>
          props.orientation === "left" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />,
      }}
      {...props}
    />
  );
}

export { Calendar };
