"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Search, X } from "lucide-react";
import {
  PageWrapper,
  Button,
  Input,
  Table,
  Badge,
  type TableColumn,
} from "@/components/ds";
import { formatRelative } from "@/lib/format";
import { useDebounce } from "@/hooks/useDebounce";
import { useUsers } from "../_hooks/api";
import { USER_STATUSES } from "../_types";
import type { TUser, TUserStatus } from "../_types";

const PAGE_SIZE = 10;

const STATUS_TONE: Record<TUserStatus, "warning" | "success" | "neutral"> = {
  pending: "warning",
  active: "success",
  disabled: "neutral",
};

const STATUS_LABEL: Record<TUserStatus, string> = {
  pending: "pending approvals",
  active: "active users",
  disabled: "disabled accounts",
};

export function UsersList() {
  const params = useSearchParams();
  const router = useRouter();
  const statusParam = params.get("status");
  const status = useMemo<TUserStatus | undefined>(
    () => ((USER_STATUSES as readonly string[]).includes(statusParam ?? "") ? (statusParam as TUserStatus) : undefined),
    [statusParam],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 300);

  const { data, isLoading } = useUsers({
    search: debounced || undefined,
    status,
    page,
    pageSize: PAGE_SIZE,
  });

  function clearStatus() {
    router.push("/users");
    setPage(1);
  }

  const columns: TableColumn<TUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{u.name}</span>
          <span className="text-xs text-foreground-subtle">{u.email}</span>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      width: "120px",
      render: (u) => <Badge tone={u.role === "admin" ? "primary" : "neutral"} variant="soft">{u.role}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      render: (u) => <Badge tone={STATUS_TONE[u.status]} variant="soft">{u.status}</Badge>,
    },
    {
      key: "created",
      header: "Joined",
      width: "140px",
      render: (u) => <span className="text-sm text-foreground-muted">{formatRelative(u.createdAt)}</span>,
    },
  ];

  return (
    <PageWrapper
      title="Users"
      subtitle="People with portal access for this HOA. Admins manage roles, statuses, and approvals here."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Users" }]}
      action={
        <Button asChild leftIcon={<Plus size={16} />}>
          <Link href="/users/create">New user</Link>
        </Button>
      }
    >
      {status ? (
        <div className="flex items-center gap-2 rounded-md border border-primary-soft bg-primary-soft px-3 py-2 text-sm">
          <span className="text-primary-soft-fg">Showing {STATUS_LABEL[status]}.</span>
          <Button variant="link" size="sm" onClick={clearStatus} leftIcon={<X size={12} />}>
            Clear filter
          </Button>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      <Table<TUser>
        columns={columns}
        data={data?.result}
        rowKey="id"
        loading={isLoading}
        pagination
        pageSize={PAGE_SIZE}
        totalCount={data?.meta.totalCount ?? 0}
        currentPage={page}
        onPageChange={setPage}
        onRowClick={(u) => (window.location.href = `/users/${u.id}`)}
        emptyMessage={
          status === "pending"
            ? "Nobody is waiting for approval."
            : "No users match this filter."
        }
      />
    </PageWrapper>
  );
}
