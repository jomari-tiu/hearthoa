"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Download, ShieldCheck, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
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
import { formatDateTime } from "@/lib/format";
import { api, extractErrorMessages } from "@/lib/api";
import { useDocument, useDeleteDocument, useClearPiiReview } from "../_hooks/api";

export default function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useDocument(id);
  const del = useDeleteDocument(id);
  const clearPii = useClearPiiReview(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doc = data?.result;

  const ingest = useMutation({
    mutationFn: async () => api.post(`/documents/${id}/ingest`),
  });

  async function handleIngest() {
    try {
      const res = await ingest.mutateAsync();
      const payload = res.data as { status: string; chunks?: number; flaggedCount?: number };
      if (payload.status === "indexed") {
        toast.success("Indexed", `${payload.chunks} chunks embedded.`);
      } else if (payload.status === "flagged") {
        toast.warning("PII flagged", `${payload.flaggedCount} matches. Review and clear when safe.`);
      } else if (payload.status === "empty") {
        toast.info("Nothing to index", "We couldn't extract any text from the file.");
      }
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't ingest", message);
    }
  }

  async function handleDelete() {
    try {
      await del.mutateAsync(undefined);
      toast.success("Document deleted");
      router.push("/documents");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't delete", message);
    }
  }

  async function handleClearPii() {
    try {
      await clearPii.mutateAsync(undefined);
      toast.success("PII review cleared", "Document will be embedded for the chatbot.");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't clear review", message);
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

  if (isError || !doc) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <Button asChild variant="outline">
          <Link href="/documents">Back to documents</Link>
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={doc.title}
      subtitle={`Uploaded ${formatDateTime(doc.createdAt)}`}
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Documents", href: "/documents" },
        { label: doc.title },
      ]}
      action={
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" leftIcon={<Download size={14} />}>
            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">Download</a>
          </Button>
          {doc.isChatbotIndexed ? (
            <Button variant="outline" leftIcon={<Sparkles size={14} />} onClick={handleIngest} loading={ingest.isPending}>
              Run ingestion
            </Button>
          ) : null}
          <Button asChild variant="outline" leftIcon={<Pencil size={14} />}>
            <Link href={`/documents/${doc.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
        </div>
      }
    >
      {doc.isChatbotIndexed && doc.piiReviewStatus === "flagged" ? (
        <Card className="border-warning">
          <CardBody className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="text-warning mt-0.5" />
              <div>
                <div className="font-semibold text-foreground">PII review required before indexing</div>
                <div className="text-sm text-foreground-muted">
                  The automatic scan flagged possible personal info. Confirm the document is safe to share with the chatbot.
                </div>
              </div>
            </div>
            <Button onClick={handleClearPii} loading={clearPii.isPending}>
              Clear and index
            </Button>
          </CardBody>
        </Card>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody className="flex flex-col gap-3 text-sm">
            <Detail label="Category" value={doc.category} />
            <Detail label="MIME type" value={doc.fileType} />
            <Detail label="Size" value={`${Number(doc.fileSizeBytes)} bytes`} />
            <Detail label="Version" value={`v${doc.version}`} />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col gap-3 text-sm">
            <Detail label="Uploaded by" value={doc.uploadedBy?.name ?? "—"} />
            <Detail label="Uploaded at" value={formatDateTime(doc.createdAt)} />
            {doc.piiReviewedAt ? (
              <Detail label="PII reviewed at" value={formatDateTime(doc.piiReviewedAt)} />
            ) : null}
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-col gap-3 text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs uppercase tracking-wide text-foreground-subtle">Chatbot status</span>
              <div className="flex items-center gap-2">
                {!doc.isChatbotIndexed ? (
                  <Badge tone="neutral" variant="soft">Not indexed</Badge>
                ) : doc.piiReviewStatus === "acknowledged_safe" ? (
                  <Badge tone="success" variant="soft">Indexed</Badge>
                ) : doc.piiReviewStatus === "flagged" ? (
                  <Badge tone="warning" variant="soft">PII review needed</Badge>
                ) : (
                  <Badge tone="neutral" variant="soft">{doc.piiReviewStatus}</Badge>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete document"
        description="The current version is deleted; older versions are kept. Chatbot chunks for this document are removed in the same transaction."
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={del.isPending}>
              Cancel
            </Button>
            <Button variant="danger" loading={del.isPending} onClick={handleDelete}>
              Delete document
            </Button>
          </>
        }
      />
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
