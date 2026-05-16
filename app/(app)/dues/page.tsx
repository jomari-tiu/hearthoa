"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Upload, Download } from "lucide-react";
import {
  PageWrapper,
  Button,
  Input,
  Table,
  Badge,
  type TableColumn,
} from "@/components/ds";
import { formatDate, formatMoney } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { useDuesList } from "./_hooks/api";
import type { TDue, TDuesStatus } from "./_types";

const PAGE_SIZE = 10;

const STATUS_TONE: Record<TDuesStatus, "neutral" | "warning" | "success" | "danger"> = {
  unpaid: "neutral",
  partial: "warning",
  paid: "success",
  late: "danger",
  waived: "neutral",
};

export default function DuesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useDuesList({
    search: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const columns: TableColumn<TDue>[] = [
    {
      key: "unit",
      header: "Unit",
      render: (row) => (
        <div className="font-medium text-foreground">
          {row.unit?.unitNumber ? `${row.unit.address} #${row.unit.unitNumber}` : row.unit?.address ?? "—"}
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      width: "100px",
      render: (row) => <span className="font-mono text-sm text-foreground-muted">{row.period}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      width: "120px",
      render: (row) => <span className="text-foreground tabular-nums">{formatMoney(row.amountCents)}</span>,
    },
    {
      key: "dueDate",
      header: "Due date",
      width: "140px",
      render: (row) => <span className="text-sm text-foreground-muted">{formatDate(row.dueDate)}</span>,
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
      render: (row) => <Badge tone={STATUS_TONE[row.status]} variant="soft">{row.status}</Badge>,
    },
  ];

  return (
    <PageWrapper
      title="Dues"
      subtitle="Track what is owed and what has been paid."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Dues" }]}
      action={
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="outline" leftIcon={<Upload size={14} />}>
            <Link href="/import/dues">Import CSV</Link>
          </Button>
          <Button asChild variant="outline" leftIcon={<Download size={14} />}>
            <a href="/api/dues/export" download>Export CSV</a>
          </Button>
          <Button asChild leftIcon={<Plus size={16} />}>
            <Link href="/dues/create">Record a due</Link>
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-3">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Search by unit or period…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      <Table<TDue>
        columns={columns}
        data={data?.result}
        rowKey="id"
        loading={isLoading}
        pagination
        pageSize={PAGE_SIZE}
        totalCount={data?.meta.totalCount ?? 0}
        currentPage={page}
        onPageChange={setPage}
        onRowClick={(row) => (window.location.href = `/dues/${row.id}`)}
      />
    </PageWrapper>
  );
}
