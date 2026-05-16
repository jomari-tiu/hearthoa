"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Receipt, FolderOpen, Wrench, MessageCircle } from "lucide-react";
import { api } from "@/lib/api";
import { PageWrapper, Card, CardBody, Button, Badge, Skeleton } from "@/components/ds";
import { formatRelative, truncate } from "@/lib/format";

type Announcement = {
  id: string;
  title: string;
  body: string;
  priority: "general" | "critical";
  publishedAt: string | null;
};

type MyRequest = {
  id: string;
  title: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  createdAt: string;
};

const STATUS_TONE = {
  new: "info",
  in_progress: "warning",
  resolved: "success",
  closed: "neutral",
} as const;

const QUICK_LINKS = [
  { href: "/maintenance-requests/create", label: "Report an issue", icon: Wrench },
  { href: "/documents", label: "Browse documents", icon: FolderOpen },
  { href: "/dues", label: "See your dues", icon: Receipt },
];

export function ResidentDashboard({ userName }: { userName: string }) {
  const announcements = useQuery({
    queryKey: ["announcements", "feed", "top3"],
    queryFn: async () => {
      const res = await api.get<{ data: Announcement[] }>("/announcements", { params: { pageSize: 3 } });
      return res.data.data;
    },
  });

  const myRequests = useQuery({
    queryKey: ["maintenance-requests", "mine", "open"],
    queryFn: async () => {
      const res = await api.get<{ data: MyRequest[] }>("/maintenance-requests", {
        params: { pageSize: 5 },
      });
      return res.data.data.filter((r) => r.status !== "closed");
    },
  });

  const firstName = userName.split(/\s+/)[0] ?? userName;

  return (
    <PageWrapper
      title={`Hi ${firstName}`}
      subtitle="Your community at a glance."
      breadcrumbs={[{ label: "Dashboard" }]}
    >
      {/* Recent announcements */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
            <Megaphone size={14} className="text-primary" /> Latest from the board
          </h2>
          <Button asChild variant="link" size="sm">
            <Link href="/announcements">See all</Link>
          </Button>
        </div>
        {announcements.isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}><CardBody><Skeleton className="h-20 w-full" /></CardBody></Card>
            ))}
          </div>
        ) : !announcements.data || announcements.data.length === 0 ? (
          <Card><CardBody><p className="text-sm text-foreground-muted">No announcements yet.</p></CardBody></Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {announcements.data.map((a) => (
              <Link key={a.id} href={`/announcements/${a.id}`} className="block">
                <Card className="h-full hover:border-border-strong transition-colors">
                  <CardBody className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Badge tone={a.priority === "critical" ? "danger" : "neutral"} variant="soft">
                        {a.priority}
                      </Badge>
                      {a.publishedAt ? (
                        <span className="text-xs text-foreground-subtle">{formatRelative(a.publishedAt)}</span>
                      ) : null}
                    </div>
                    <div className="font-semibold text-foreground line-clamp-2">{a.title}</div>
                    <p className="text-xs text-foreground-muted line-clamp-2">{truncate(a.body, 140)}</p>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* My maintenance requests */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground inline-flex items-center gap-2">
            <Wrench size={14} className="text-primary" /> Your open maintenance requests
          </h2>
          <Button asChild variant="link" size="sm">
            <Link href="/maintenance-requests">See all</Link>
          </Button>
        </div>
        {myRequests.isLoading ? (
          <Card><CardBody><Skeleton className="h-16 w-full" /></CardBody></Card>
        ) : !myRequests.data || myRequests.data.length === 0 ? (
          <Card>
            <CardBody className="flex items-center justify-between gap-3">
              <p className="text-sm text-foreground-muted">No open requests. Nice.</p>
              <Button asChild size="sm" variant="outline">
                <Link href="/maintenance-requests/create">Report an issue</Link>
              </Button>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody className="flex flex-col divide-y divide-border">
              {myRequests.data.map((r) => (
                <Link
                  key={r.id}
                  href={`/maintenance-requests/${r.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:bg-surface-hover rounded-md px-2 -mx-2 transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-foreground truncate">{r.title}</span>
                    <span className="text-xs text-foreground-subtle">{formatRelative(r.createdAt)}</span>
                  </div>
                  <Badge tone={STATUS_TONE[r.status]} variant="soft">{r.status.replace("_", " ")}</Badge>
                </Link>
              ))}
            </CardBody>
          </Card>
        )}
      </section>

      {/* Quick actions */}
      <Card>
        <CardBody className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-foreground">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
          <p className="text-xs text-foreground-subtle inline-flex items-center gap-1">
            <MessageCircle size={11} /> Have a question about HOA rules? Use the chatbot bottom-right.
          </p>
        </CardBody>
      </Card>
    </PageWrapper>
  );
}
