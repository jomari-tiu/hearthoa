"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PageWrapper, Skeleton, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { DocumentForm } from "../../_components/form/DocumentForm";
import { useDocument, useUpdateDocument } from "../../_hooks/api";
import type { TDocumentFormValues } from "../../_types";

export default function EditDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, isError } = useDocument(id);
  const update = useUpdateDocument(id);

  const doc = data?.result;

  async function handleSubmit(values: TDocumentFormValues) {
    try {
      await update.mutateAsync(values);
      toast.success("Document updated");
      router.push(`/documents/${id}`);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't save", message);
    }
  }

  if (isLoading) {
    return (
      <PageWrapper title="Edit document" breadcrumbs={[]}>
        <Skeleton className="h-40 w-full" />
      </PageWrapper>
    );
  }

  if (isError || !doc) {
    return (
      <PageWrapper title="Not found" breadcrumbs={[]}>
        <p className="text-sm text-foreground-muted">This document may have been deleted.</p>
      </PageWrapper>
    );
  }

  const defaultValues: TDocumentFormValues = {
    title: doc.title,
    category: doc.category,
    fileUrl: doc.fileUrl,
    fileType: doc.fileType,
    fileSizeBytes: Number(doc.fileSizeBytes),
    isChatbotIndexed: doc.isChatbotIndexed,
  };

  return (
    <PageWrapper
      title="Edit document"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Documents", href: "/documents" },
        { label: doc.title, href: `/documents/${id}` },
        { label: "Edit" },
      ]}
    >
      <div className="max-w-3xl">
        <DocumentForm
          mode="edit"
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          loading={update.isPending}
        />
      </div>
    </PageWrapper>
  );
}
