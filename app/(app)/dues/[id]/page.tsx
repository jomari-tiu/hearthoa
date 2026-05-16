"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
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
import { formatDate, formatDateTime, formatMoney } from "@/lib/format";
import { extractErrorMessages } from "@/lib/api";
import { useDue, useDeleteDue } from "../_hooks/api";
import type { TDuesStatus } from "../_types";

const STATUS_TONE: Record<TDuesStatus, "neutral" | "warning" | "success" | "danger"> = {
  unpaid: "neutral",
  partial: "warning",
  paid: "success",
  late: "danger",
  waived: "neutral",
};

export default function DueDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useDue(id);
  const del = useDeleteDue(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const due = data?.result;

  async function handleDelete() {
    try {
      await del.mutateAsync(undefined);
      toast.success("Due removed");
      router.push("/dues");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't delete", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title={<Skeleton className="h-7 w-72" />} breadcrumbs={[]}>
        <Card>
          <CardBody>
            <Skeleton className="h-32 w-full" />
          </CardBody>
        </Card>
      </PageWrapper>
    );
  }

  if (isError || !due) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <Button asChild variant="outline">
          <Link href="/dues">Back to dues</Link>
        </Button>
      </PageWrapper>
    );
  }

  const totalAllocated = due.allocations.reduce((sum, a) => sum + a.allocatedCents, 0);
  const balanceCents = due.amountCents - totalAllocated;

  return (
    <PageWrapper
      title={`Period ${due.period}`}
      subtitle={due.unit?.unitNumber ? `${due.unit.address} #${due.unit.unitNumber}` : due.unit?.address ?? ""}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Dues", href: "/dues" },
        { label: due.period },
      ]}
      action={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" leftIcon={<Pencil size={14} />}>
            <Link href={`/dues/${due.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-foreground-subtle">Amount</span>
            <span className="text-2xl font-semibold text-foreground tabular-nums">{formatMoney(due.amountCents)}</span>
            <span className="text-xs text-foreground-muted">Due {formatDate(due.dueDate)}</span>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-foreground-subtle">Allocated</span>
            <span className="text-2xl font-semibold text-foreground tabular-nums">{formatMoney(totalAllocated)}</span>
            <span className="text-xs text-foreground-muted">{due.allocations.length} payments</span>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-foreground-subtle">Balance</span>
            <span className={`text-2xl font-semibold tabular-nums ${balanceCents > 0 ? "text-danger" : "text-foreground"}`}>
              {formatMoney(Math.max(0, balanceCents))}
            </span>
            <Badge tone={STATUS_TONE[due.status]} variant="soft">{due.status}</Badge>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h2 className="text-sm font-semibold text-foreground mb-3">Allocated payments</h2>
          {due.allocations.length === 0 ? (
            <p className="text-sm text-foreground-muted">No payments allocated yet.</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {due.allocations.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-foreground font-medium">{a.payment.method}</span>
                    <span className="text-xs text-foreground-subtle">
                      {formatDateTime(a.payment.paidAt)} · ref {a.payment.reference ?? "—"}
                    </span>
                  </div>
                  <span className="text-foreground tabular-nums">{formatMoney(a.allocatedCents)}</span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {due.notes ? (
        <Card>
          <CardBody>
            <h2 className="text-sm font-semibold text-foreground mb-2">Notes</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap">{due.notes}</p>
          </CardBody>
        </Card>
      ) : null}

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete due"
        description="Allocated payments stay on the books. Only the due record is removed."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={del.isPending}>
              Cancel
            </Button>
            <Button variant="danger" loading={del.isPending} onClick={handleDelete}>
              Delete due
            </Button>
          </>
        }
      />
    </PageWrapper>
  );
}
