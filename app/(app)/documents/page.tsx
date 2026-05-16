"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, FileText, FileWarning, Download } from "lucide-react";
import {
  PageWrapper,
  Button,
  Input,
  Table,
  Badge,
  type TableColumn,
} from "@/components/ds";
import { formatDate } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocuments } from "./_hooks/api";
import type { TDocument } from "./_types";

const PAGE_SIZE = 10;

function bytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useDocuments({
    search: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const columns: TableColumn<TDocument>[] = [
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <div className="flex items-start gap-2">
          <FileText size={14} className="mt-1 text-foreground-subtle" />
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate">{row.title}</div>
            <div className="text-xs text-foreground-subtle truncate">
              {row.fileType} · {bytes(Number(row.fileSizeBytes))} · v{row.version}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      width: "140px",
      render: (row) => <Badge tone="neutral" variant="soft">{row.category}</Badge>,
    },
    {
      key: "chatbot",
      header: "Chatbot",
      width: "180px",
      render: (row) => {
        if (!row.isChatbotIndexed) return <span className="text-xs text-foreground-subtle">Not indexed</span>;
        if (row.piiReviewStatus === "flagged") {
          return (
            <Badge tone="warning" variant="soft">
              <FileWarning size={12} /> PII review needed
            </Badge>
          );
        }
        if (row.piiReviewStatus === "acknowledged_safe") {
          return <Badge tone="success" variant="soft">Indexed</Badge>;
        }
        return <Badge tone="neutral" variant="soft">{row.piiReviewStatus}</Badge>;
      },
    },
    {
      key: "createdAt",
      header: "Uploaded",
      width: "120px",
      render: (row) => <span className="text-sm text-foreground-muted">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <PageWrapper
      title="Documents"
      subtitle="Governing documents, minutes, financials, forms."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Documents" }]}
      action={
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="outline" leftIcon={<Download size={14} />}>
            <a href="/api/documents/export" download>Export all (.zip)</a>
          </Button>
          <Button asChild leftIcon={<Plus size={16} />}>
            <Link href="/documents/create">Upload</Link>
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Search by title or category…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      <Table<TDocument>
        columns={columns}
        data={data?.result}
        rowKey="id"
        loading={isLoading}
        pagination
        pageSize={PAGE_SIZE}
        totalCount={data?.meta.totalCount ?? 0}
        currentPage={page}
        onPageChange={setPage}
        onRowClick={(row) => (window.location.href = `/documents/${row.id}`)}
      />
    </PageWrapper>
  );
}
