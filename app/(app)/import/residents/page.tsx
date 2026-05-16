"use client";

import { useState } from "react";
import { api, extractErrorMessages } from "@/lib/api";
import { PageWrapper, Card, CardBody, Badge, BulkImportDrop, toast } from "@/components/ds";

type Summary = {
  summary: { total: number; created: number; skipped: number; errors: number };
  results: Array<
    | { row: number; status: "created"; userId: string; email: string }
    | { row: number; status: "skipped"; reason: string; email?: string }
    | { row: number; status: "error"; reason: string; email?: string }
  >;
};

export default function ResidentsImportPage() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Summary | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setResult(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post<Summary>("/imports/residents", fd, {
        headers: { "content-type": "multipart/form-data" },
      });
      setResult(res.data);
      toast.success("Import finished", `${res.data.summary.created} new residents`);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Import failed", message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageWrapper
      title="Import residents"
      subtitle="Upload a CSV with columns: email, name, unitAddress, unitNumber (optional), phone (optional), preferredLanguage (optional)."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Import residents" }]}
    >
      <Card>
        <CardBody className="flex flex-col gap-4">
          <BulkImportDrop
            label="Drop residents.csv"
            hint="or click to browse"
            max="25 MB"
            onFile={handleFile}
          />
          <p className="text-xs text-foreground-subtle">
            Tip: name your CSV columns exactly as listed. Re-uploading the same CSV is safe — duplicates are skipped.
          </p>
        </CardBody>
      </Card>

      {busy ? (
        <Card><CardBody><p className="text-sm text-foreground-muted">Importing…</p></CardBody></Card>
      ) : null}

      {result ? (
        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="success" variant="soft">{result.summary.created} created</Badge>
              <Badge tone="warning" variant="soft">{result.summary.skipped} skipped</Badge>
              <Badge tone="danger" variant="soft">{result.summary.errors} errors</Badge>
              <Badge tone="neutral" variant="soft">{result.summary.total} total</Badge>
            </div>
            <div className="max-h-96 overflow-y-auto flex flex-col divide-y divide-border">
              {result.results.map((r) => (
                <div key={`${r.row}`} className="py-2 text-sm flex items-center justify-between gap-3">
                  <span className="text-foreground-muted">Row {r.row}</span>
                  {r.status === "created" ? (
                    <span className="text-success">created · {r.email}</span>
                  ) : r.status === "skipped" ? (
                    <span className="text-foreground-muted">skipped · {r.reason}</span>
                  ) : (
                    <span className="text-danger">{r.reason}</span>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      ) : null}
    </PageWrapper>
  );
}
