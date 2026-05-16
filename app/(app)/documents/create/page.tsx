"use client";

import { useRouter } from "next/navigation";
import { PageWrapper, toast } from "@/components/ds";
import { extractErrorMessages } from "@/lib/api";
import { DocumentForm } from "../_components/form/DocumentForm";
import { INIT_DOCUMENT } from "../_constant";
import { useCreateDocument } from "../_hooks/api";
import type { TDocumentFormValues } from "../_types";

export default function CreateDocumentPage() {
  const router = useRouter();
  const create = useCreateDocument();

  async function handleSubmit(values: TDocumentFormValues) {
    try {
      await create.mutateAsync(values);
      toast.success("Document uploaded");
      router.push("/documents");
    } catch (error) {
      const [message] = extractErrorMessages(error);
      toast.error("Couldn't upload", message);
    }
  }

  return (
    <PageWrapper
      title="Upload document"
      subtitle="PDF, DOCX, or image up to 25 MB. PII scan runs before chatbot indexing."
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Documents", href: "/documents" },
        { label: "Upload" },
      ]}
    >
      <div className="max-w-3xl">
        <DocumentForm
          mode="create"
          defaultValues={INIT_DOCUMENT}
          onSubmit={handleSubmit}
          loading={create.isPending}
        />
      </div>
    </PageWrapper>
  );
}
