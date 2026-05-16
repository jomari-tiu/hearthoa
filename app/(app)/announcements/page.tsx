"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pin } from "lucide-react";
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
import { useAnnouncements } from "./_hooks/api";
import type { TAnnouncement } from "./_types";

const PAGE_SIZE = 10;

export default function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useAnnouncements({
    search: debouncedSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  const columns: TableColumn<TAnnouncement>[] = [
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <div className="flex items-start gap-2">
          {row.isPinned ? <Pin size={14} className="mt-0.5 text-primary" /> : null}
          <div className="min-w-0">
            <div className="font-medium text-foreground truncate">{row.title}</div>
            <div className="text-xs text-foreground-subtle truncate">{truncate(row.body, 100)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      width: "140px",
      render: (row) =>
        row.priority === "critical" ? (
          <Badge tone="danger" variant="soft">Critical</Badge>
        ) : (
          <Badge tone="neutral" variant="soft">General</Badge>
        ),
    },
    {
      key: "author",
      header: "Author",
      width: "180px",
      render: (row) => <span className="text-sm text-foreground-muted">{row.author?.name ?? "—"}</span>,
    },
    {
      key: "publishedAt",
      header: "Published",
      width: "160px",
      render: (row) => (
        <span className="text-sm text-foreground-muted">
          {row.publishedAt ? formatRelative(row.publishedAt) : "Draft"}
        </span>
      ),
    },
  ];

  return (
    <PageWrapper
      title="Announcements"
      subtitle="Updates from the board to all residents."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Announcements" }]}
      action={
        <Button asChild leftIcon={<Plus size={16} />}>
          <Link href="/announcements/create">New announcement</Link>
        </Button>
      }
    >
      <div className="flex items-center gap-3">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Search title or body…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table<TAnnouncement>
        columns={columns}
        data={data?.result}
        rowKey="id"
        loading={isLoading}
        pagination
        pageSize={PAGE_SIZE}
        totalCount={data?.meta.totalCount ?? 0}
        currentPage={page}
        onPageChange={setPage}
        onRowClick={(row) => (window.location.href = `/announcements/${row.id}`)}
        emptyMessage={
          <div className="flex flex-col items-center gap-1.5 py-6">
            <span className="text-sm font-medium text-foreground">No announcements yet</span>
            <span className="text-xs text-foreground-subtle">
              Post the first one so residents see it on their dashboard.
            </span>
            <Button asChild size="sm" variant="outline" className="mt-2">
              <Link href="/announcements/create">Post the first announcement</Link>
            </Button>
          </div>
        }
      />
    </PageWrapper>
  );
}
