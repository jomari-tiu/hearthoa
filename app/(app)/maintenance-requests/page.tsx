"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import {
  PageWrapper,
  Button,
  Input,
  Table,
  Badge,
  type TableColumn,
} from "@/components/ds";
import { formatRelative, truncate } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { useMaintenanceRequests } from "./_hooks/api";
import type { TMaintenanceRequest, TMaintenanceStatus } from "./_types";

const PAGE_SIZE = 10;

const STATUS_TONE: Record<TMaintenanceStatus, "info" | "warning" | "success" | "neutral"> = {
  new: "info",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
};

export default function MaintenanceRequestsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useMaintenanceRequests({
    search: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const columns: TableColumn<TMaintenanceRequest>[] = [
    {
      key: "title",
      header: "Request",
      render: (row) => (
        <div className="min-w-0">
          <div className="font-medium text-foreground truncate">{row.title}</div>
          <div className="text-xs text-foreground-subtle truncate">{truncate(row.description, 100)}</div>
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
      key: "status",
      header: "Status",
      width: "140px",
      render: (row) => <Badge tone={STATUS_TONE[row.status]} variant="soft">{row.status.replace("_", " ")}</Badge>,
    },
    {
      key: "submittedBy",
      header: "From",
      width: "180px",
      render: (row) => <span className="text-sm text-foreground-muted">{row.submittedBy?.name ?? "—"}</span>,
    },
    {
      key: "createdAt",
      header: "Submitted",
      width: "140px",
      render: (row) => <span className="text-sm text-foreground-muted">{formatRelative(row.createdAt)}</span>,
    },
  ];

  return (
    <PageWrapper
      title="Maintenance requests"
      subtitle="Common-area issues residents have reported."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Maintenance" }]}
      action={
        <Button asChild leftIcon={<Plus size={16} />}>
          <Link href="/maintenance-requests/create">Submit request</Link>
        </Button>
      }
    >
      <div className="flex items-center gap-3">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Search title or description…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      <Table<TMaintenanceRequest>
        columns={columns}
        data={data?.result}
        rowKey="id"
        loading={isLoading}
        pagination
        pageSize={PAGE_SIZE}
        totalCount={data?.meta.totalCount ?? 0}
        currentPage={page}
        onPageChange={setPage}
        onRowClick={(row) => (window.location.href = `/maintenance-requests/${row.id}`)}
      />
    </PageWrapper>
  );
}
