"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Check, X } from "lucide-react";
import {
  PageWrapper,
  Card,
  CardBody,
  Button,
  Badge,
  Dialog,
  Skeleton,
  toast,
} from "@/components/ds";
import { api, extractErrorMessages } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { useUser, useDeleteUser } from "../_hooks/api";
import { USERS_KEY } from "../_constant";
import type { TUserStatus } from "../_types";

const STATUS_TONE: Record<TUserStatus, "warning" | "success" | "neutral"> = {
  pending: "warning",
  active: "success",
  disabled: "neutral",
};

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const qc = useQueryClient();
  const { data, isLoading, isError } = useUser(id);
  const del = useDeleteUser(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const user = data?.result;

  const approve = useMutation({
    mutationFn: async () => api.post(`/users/${id}/approve`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });
  const reject = useMutation({
    mutationFn: async () => api.post(`/users/${id}/reject`),
    onSuccess: () => qc.invalidateQueries({ queryKey: [USERS_KEY] }),
  });

  async function handleDelete() {
    try {
      await del.mutateAsync(undefined);
      toast.success("User removed");
      router.push("/users");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't remove user", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title={<Skeleton className="h-7 w-64" />} breadcrumbs={[]}>
        <Card><CardBody><Skeleton className="h-32 w-full" /></CardBody></Card>
      </PageWrapper>
    );
  }
  if (isError || !user) {
    return (
      <PageWrapper title="User not found" breadcrumbs={[]}>
        <Button asChild variant="outline"><Link href="/users">Back to users</Link></Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={user.name}
      subtitle={user.email}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Users", href: "/users" },
        { label: user.name },
      ]}
      action={
        <div className="flex items-center gap-2">
          {user.status === "pending" ? (
            <>
              <Button
                variant="outline"
                leftIcon={<X size={14} />}
                onClick={async () => {
                  await reject.mutateAsync();
                  toast.success("Rejected");
                }}
                loading={reject.isPending}
              >
                Reject
              </Button>
              <Button
                leftIcon={<Check size={14} />}
                onClick={async () => {
                  await approve.mutateAsync();
                  toast.success("Approved");
                }}
                loading={approve.isPending}
              >
                Approve
              </Button>
            </>
          ) : null}
          <Button asChild variant="outline" leftIcon={<Pencil size={14} />}>
            <Link href={`/users/${user.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => setConfirmOpen(true)}>
            Remove
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex flex-col gap-2 text-sm">
            <Detail label="Role" value={<Badge tone={user.role === "admin" ? "primary" : "neutral"} variant="soft">{user.role}</Badge>} />
            <Detail label="Status" value={<Badge tone={STATUS_TONE[user.status]} variant="soft">{user.status}</Badge>} />
            <Detail label="Language" value={user.preferredLanguage.toUpperCase()} />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-2 text-sm">
            <Detail label="Email" value={user.email} />
            <Detail label="Phone" value={user.phone || "—"} />
            <Detail label="Directory opt-out" value={user.directoryOptOut ? "Yes" : "No"} />
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-2 text-sm">
            <Detail label="Created" value={formatDateTime(user.createdAt)} />
            <Detail label="Last updated" value={formatDateTime(user.updatedAt)} />
            <Detail label="Email verified" value={user.emailVerifiedAt ? formatDateTime(user.emailVerifiedAt) : "Not verified"} />
          </CardBody>
        </Card>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Remove user"
        description="Soft-delete only — the row stays in the database for audit, but the user can't sign in and their data is hidden from listings."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={del.isPending}>Cancel</Button>
            <Button variant="danger" loading={del.isPending} onClick={handleDelete}>Remove user</Button>
          </>
        }
      />
    </PageWrapper>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-foreground-subtle">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
