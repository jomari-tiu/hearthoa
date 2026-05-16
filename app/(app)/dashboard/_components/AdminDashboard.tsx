"use client";

import Link from "next/link";
import { Megaphone, Receipt, FolderOpen, Wrench } from "lucide-react";
import { PageWrapper, Card, CardBody, Button, Badge } from "@/components/ds";

const QUICK_LINKS = [
  { href: "/announcements/create", label: "Post an announcement", icon: Megaphone },
  { href: "/dues/create", label: "Record a payment", icon: Receipt },
  { href: "/documents/create", label: "Upload a document", icon: FolderOpen },
  { href: "/maintenance-requests", label: "Open maintenance requests", icon: Wrench },
];

export function AdminDashboard() {
  return (
    <PageWrapper
      title="Welcome back"
      subtitle="What needs your attention today."
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/users?status=pending" className="block">
          <Card className="hover:border-border-strong transition-colors h-full">
            <CardBody className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-foreground-subtle">Pending registrations</span>
              <span className="text-2xl font-semibold text-foreground">0</span>
              <span className="text-xs text-foreground-muted">Approve new residents →</span>
            </CardBody>
          </Card>
        </Link>
        <Card>
          <CardBody className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-foreground-subtle">Open maintenance</span>
            <span className="text-2xl font-semibold text-foreground">0</span>
            <span className="text-xs text-foreground-muted">Across all categories</span>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-foreground-subtle">Delinquent units</span>
            <span className="text-2xl font-semibold text-foreground">0</span>
            <span className="text-xs text-foreground-muted">Past due this period</span>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-foreground-subtle">AI spend this month</span>
            <span className="text-2xl font-semibold text-foreground">$0</span>
            <span className="text-xs text-foreground-muted">
              <Badge tone="success" variant="soft">Within budget</Badge>
            </span>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <Button key={q.href} asChild variant="outline" className="justify-start">
                  <Link href={q.href}>
                    <Icon size={16} />
                    {q.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </PageWrapper>
  );
}
