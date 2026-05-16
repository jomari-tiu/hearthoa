"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { api, type ApiResult } from "@/lib/api";
import { PageWrapper, Card, CardBody, Button, Badge, Skeleton, toast } from "@/components/ds";
import { formatDate } from "@/lib/format";

type DocItem = {
  id: string;
  title: string;
  category: string;
  piiReviewStatus: "pending" | "acknowledged_safe" | "flagged" | "excluded";
  createdAt: string;
  uploadedBy: { name: string } | null;
};

export default function PiiReviewPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery<ApiResult<DocItem[]>>({
    queryKey: ["documents", "pii-review"],
    queryFn: async () => {
      const res = await api.get<{ data: DocItem[]; meta: { page: number; pageSize: number; totalCount: number; hasNext: boolean } }>(
        "/documents",
        { params: { pageSize: 100 } },
      );
      const flagged = res.data.data.filter((d) => d.piiReviewStatus === "flagged" || d.piiReviewStatus === "pending");
      return { result: flagged, meta: res.data.meta };
    },
  });

  const clear = useMutation({
    mutationFn: async (id: string) => api.post(`/documents/${id}/pii-review/clear`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["documents", "pii-review"] }),
  });

  async function handleClear(id: string) {
    try {
      await clear.mutateAsync(id);
      toast.success("Cleared", "Document will be embedded for the chatbot.");
    } catch {
      toast.error("Couldn't clear");
    }
  }

  return (
    <PageWrapper
      title="PII review queue"
      subtitle="Documents waiting for admin acknowledgement before they enter the chatbot index."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Documents", href: "/documents" },
        { label: "PII review" },
      ]}
    >
      {isLoading ? (
        <Card><CardBody><Skeleton className="h-32 w-full" /></CardBody></Card>
      ) : !data || data.result.length === 0 ? (
        <Card>
          <CardBody className="flex items-start gap-3">
            <ShieldCheck size={20} className="text-success mt-0.5" />
            <div>
              <h2 className="text-base font-semibold text-foreground">All clear</h2>
              <p className="text-sm text-foreground-muted">No documents are waiting on PII review.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {data.result.map((d) => (
            <Card key={d.id}>
              <CardBody className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1 min-w-0">
                  <Link href={`/documents/${d.id}`} className="font-semibold text-foreground hover:underline truncate">
                    {d.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-foreground-muted">
                    <Badge tone="neutral" variant="soft">{d.category}</Badge>
                    {d.piiReviewStatus === "flagged" ? (
                      <Badge tone="warning" variant="soft">PII flagged</Badge>
                    ) : (
                      <Badge tone="neutral" variant="soft">Pending scan</Badge>
                    )}
                    <span>Uploaded {formatDate(d.createdAt)} by {d.uploadedBy?.name ?? "—"}</span>
                  </div>
                </div>
                <Button onClick={() => handleClear(d.id)} loading={clear.isPending && clear.variables === d.id}>
                  Clear and index
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
