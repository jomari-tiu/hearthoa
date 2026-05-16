"use client";

import { use } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  PageWrapper,
  Card,
  CardBody,
  Button,
  Badge,
  Skeleton,
} from "@/components/ds";
import { formatDateTime, formatRelative } from "@/lib/format";
import { useMaintenanceRequest } from "../_hooks/api";
import type { TMaintenanceStatus } from "../_types";

const STATUS_TONE: Record<TMaintenanceStatus, "info" | "warning" | "success" | "neutral"> = {
  new: "info",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
};

export default function MaintenanceRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, isError } = useMaintenanceRequest(id);
  const req = data?.result;

  if (isLoading) {
    return (
      <PageWrapper title={<Skeleton className="h-7 w-72" />} breadcrumbs={[]}>
        <Card><CardBody><Skeleton className="h-32 w-full" /></CardBody></Card>
      </PageWrapper>
    );
  }

  if (isError || !req) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <Button asChild variant="outline">
          <Link href="/maintenance-requests">Back to requests</Link>
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={req.title}
      subtitle={`Submitted ${formatRelative(req.createdAt)} by ${req.submittedBy?.name ?? "a resident"}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Maintenance", href: "/maintenance-requests" },
        { label: req.title },
      ]}
      action={
        <Button asChild variant="outline" leftIcon={<Pencil size={14} />}>
          <Link href={`/maintenance-requests/${req.id}/edit`}>Edit</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={STATUS_TONE[req.status]} variant="soft">{req.status.replace("_", " ")}</Badge>
              <Badge tone="neutral" variant="soft">{req.category}</Badge>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap">{req.description}</p>
            {req.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={req.photoUrl} alt="Reported by resident" className="rounded-md border border-border max-w-full" />
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col gap-3 text-sm">
            <Detail label="Unit" value={req.unit?.unitNumber ? `${req.unit.address} #${req.unit.unitNumber}` : req.unit?.address ?? "—"} />
            <Detail label="Assigned to" value={req.assignedTo ?? "—"} />
            <Detail label="Submitted" value={formatDateTime(req.createdAt)} />
            {req.resolvedAt ? <Detail label="Resolved" value={formatDateTime(req.resolvedAt)} /> : null}
            {req.closedAt ? <Detail label="Closed" value={formatDateTime(req.closedAt)} /> : null}
          </CardBody>
        </Card>
      </div>

      {req.adminNotes ? (
        <Card>
          <CardBody>
            <h2 className="text-sm font-semibold text-foreground mb-2">Internal notes</h2>
            <p className="text-sm text-foreground whitespace-pre-wrap">{req.adminNotes}</p>
          </CardBody>
        </Card>
      ) : null}
    </PageWrapper>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-foreground-subtle">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
