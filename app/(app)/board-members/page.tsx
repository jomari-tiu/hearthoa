"use client";

import Link from "next/link";
import { Plus, Mail } from "lucide-react";
import { PageWrapper, Card, CardBody, Button, Badge, Skeleton } from "@/components/ds";
import { formatDate } from "@/lib/format";
import { initials } from "@/lib/format";
import { useBoardMembers } from "./_hooks/api";

export default function BoardMembersPage() {
  const { data, isLoading } = useBoardMembers();
  const members = data?.result ?? [];

  return (
    <PageWrapper
      title="Board"
      subtitle="Volunteer leaders responsible for community decisions."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Board" }]}
      action={
        <Button asChild leftIcon={<Plus size={16} />}>
          <Link href="/board-members/create">Add member</Link>
        </Button>
      }
    >
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardBody><Skeleton className="h-24 w-full" /></CardBody></Card>
          ))}
        </div>
      ) : members.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col items-start gap-2">
            <h2 className="text-base font-semibold text-foreground">No board members yet</h2>
            <p className="text-sm text-foreground-muted">Add your first member to share who residents can contact.</p>
            <Button asChild className="mt-2" size="sm">
              <Link href="/board-members/create">Add first member</Link>
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <Link key={m.id} href={`/board-members/${m.id}`}>
              <Card className="hover:border-border-strong transition-colors h-full">
                <CardBody className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-primary-soft text-primary-soft-fg inline-flex items-center justify-center font-bold">
                    {initials(m.name)}
                  </div>
                  <div className="min-w-0 flex flex-col gap-1">
                    <span className="font-semibold text-foreground truncate">{m.name}</span>
                    <Badge tone="primary" variant="soft">{m.role}</Badge>
                    {m.email ? (
                      <span className="text-xs text-foreground-muted inline-flex items-center gap-1">
                        <Mail size={12} /> {m.email}
                      </span>
                    ) : null}
                    {m.termEnd ? (
                      <span className="text-xs text-foreground-subtle">Term ends {formatDate(m.termEnd)}</span>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
