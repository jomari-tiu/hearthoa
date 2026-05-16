"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export type BulkImportDropProps = {
  accept?: string;
  label?: string;
  hint?: string;
  max?: string;
  onFile?: (file: File) => void;
};

export function BulkImportDrop({
  accept = ".csv,text/csv",
  label = "Drop CSV here",
  hint = "or click to browse",
  max,
  onFile,
}: BulkImportDropProps) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label
      htmlFor="bulk-import-input"
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files?.[0];
        if (file && onFile) onFile(file);
      }}
      className={cn(
        "flex flex-col items-center gap-2 p-8 rounded-md border-2 border-dashed bg-surface-2 cursor-pointer transition-colors",
        drag ? "border-primary bg-primary-soft" : "border-border-strong hover:border-foreground-subtle",
      )}
    >
      <Upload size={20} className="text-foreground-subtle" />
      <div className="text-sm font-semibold text-foreground">{label}</div>
      <div className="text-xs text-foreground-subtle">{hint}</div>
      {max ? <div className="text-xs text-foreground-subtle">Up to {max}</div> : null}
      <input
        ref={inputRef}
        id="bulk-import-input"
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onFile) onFile(file);
        }}
      />
    </label>
  );
}
