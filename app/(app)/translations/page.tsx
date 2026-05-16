"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { api, type ApiResult } from "@/lib/api";
import { PageWrapper, Card, CardBody, Button, Badge, Skeleton, toast } from "@/components/ds";
import { formatRelative } from "@/lib/format";

type Translation = {
  id: string;
  language: string;
  title: string;
  body: string;
  isAutoTranslated: boolean;
  reviewedBy: { id: string; name: string } | null;
  reviewedAt: string | null;
  announcement: { id: string; title: string; sourceLanguage: string; priority: "general" | "critical" };
  createdAt: string;
};

export default function TranslationsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ApiResult<Translation[]>>({
    queryKey: ["translations", "unreviewed"],
    queryFn: async () => {
      const res = await api.get<{ data: Translation[]; meta: { page: number; pageSize: number; totalCount: number; hasNext: boolean } }>(
        "/translations",
        { params: { reviewed: "false", pageSize: 100 } },
      );
      return { result: res.data.data, meta: res.data.meta };
    },
  });

  const review = useMutation({
    mutationFn: async (id: string) => api.post(`/translations/${id}/review`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["translations", "unreviewed"] }),
  });

  async function handleReview(id: string) {
    try {
      await review.mutateAsync(id);
      toast.success("Translation marked reviewed");
    } catch {
      toast.error("Couldn't mark reviewed");
    }
  }

  return (
    <PageWrapper
      title="Translation review"
      subtitle="Machine-translated announcements waiting for a bilingual reviewer to confirm."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Translations" }]}
    >
      {isLoading ? (
        <Card><CardBody><Skeleton className="h-32 w-full" /></CardBody></Card>
      ) : !data || data.result.length === 0 ? (
        <Card>
          <CardBody className="flex flex-col gap-1">
            <h2 className="text-base font-semibold text-foreground">All reviewed</h2>
            <p className="text-sm text-foreground-muted">No translations are waiting on review.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {data.result.map((t) => (
            <Card key={t.id}>
              <CardBody className="flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="primary" variant="soft">{t.language.toUpperCase()}</Badge>
                    {t.announcement.priority === "critical" ? (
                      <Badge tone="danger" variant="soft">Critical</Badge>
                    ) : (
                      <Badge tone="neutral" variant="soft">General</Badge>
                    )}
                    <Link href={`/announcements/${t.announcement.id}`} className="text-sm font-medium text-foreground hover:underline">
                      {t.announcement.title}
                    </Link>
                  </div>
                  <Button size="sm" onClick={() => handleReview(t.id)} loading={review.isPending && review.variables === t.id} leftIcon={<Check size={14} />}>
                    Mark reviewed
                  </Button>
                </div>
                <p className="text-xs text-foreground-subtle">Source language: {t.announcement.sourceLanguage.toUpperCase()} · Created {formatRelative(t.createdAt)}</p>
                <div className="rounded-md border border-border bg-surface-2 p-3">
                  <div className="text-sm font-semibold text-foreground mb-1">{t.title}</div>
                  <div className="text-sm text-foreground whitespace-pre-wrap line-clamp-6">{t.body}</div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
