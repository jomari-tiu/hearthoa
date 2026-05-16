import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, requireAdmin } from "@/lib/session";
import { route } from "@/lib/handler";
import { readFileFromUrl } from "@/lib/storage";
import { extractText } from "@/lib/parsers";
import { scanPii } from "@/lib/pii-scan";
import { chunkText } from "@/lib/chunking";
import { embed } from "@/lib/embeddings";

type Params = { id: string };

// Runs the ingestion pipeline for a single document:
//   1. fetch file
//   2. extract text
//   3. PII scan → status
//   4. chunk
//   5. embed (or stub)
//   6. write chunks (replacing any older chunks for this document)
export const POST = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;

  const doc = await prisma.document.findFirst({
    where: { id, hoaId: session.hoaId },
  });
  if (!doc) throw new ApiError(404, "Document not found.");

  let buffer: Buffer;
  try {
    buffer = await readFileFromUrl(doc.fileUrl);
  } catch (error) {
    throw new ApiError(400, error instanceof Error ? error.message : "Couldn't read the file.");
  }

  const text = await extractText(buffer, doc.fileType);
  const pii = scanPii(text);

  // Always record the scan result + metadata.
  const piiMetadata = {
    flaggedCount: pii.matches.length,
    sampleMatches: pii.matches.slice(0, 10).map((m) => ({ type: m.type, value: maskValue(m.value) })),
  };

  // If flagged, stop here — chunks/embedding wait for admin acknowledgement.
  if (pii.flagged) {
    await prisma.document.update({
      where: { id },
      data: { piiReviewStatus: "flagged" },
    });
    await prisma.auditLog.create({
      data: {
        hoaId: session.hoaId,
        userId: session.userId,
        action: "ingest_flagged",
        entityType: "document",
        entityId: id,
        metadata: piiMetadata,
      },
    });
    return NextResponse.json({
      status: "flagged",
      flaggedCount: pii.matches.length,
      matches: piiMetadata.sampleMatches,
    });
  }

  const chunks = chunkText(text);
  if (chunks.length === 0) {
    return NextResponse.json({ status: "empty", chunks: 0 });
  }

  const { vectors, model } = await embed(chunks.map((c) => c.content));

  // Replace old chunks transactionally so the chatbot never cites stale content.
  await prisma.$transaction(async (tx) => {
    await tx.documentChunk.deleteMany({ where: { documentId: id } });

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (!chunk) continue;
      const vec = vectors[i] ?? new Array<number>(1536).fill(0);
      // Insert via raw SQL because the embedding column is pgvector (Unsupported in Prisma).
      const literal = `[${vec.join(",")}]`;
      await tx.$executeRawUnsafe(
        `INSERT INTO document_chunks (id, hoa_id, document_id, chunk_index, content, page_number, section, embedding_model, embedding, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8::vector, NOW())`,
        session.hoaId,
        id,
        chunk.index,
        chunk.content,
        chunk.pageNumber,
        chunk.section,
        model,
        literal,
      );
    }

    await tx.document.update({
      where: { id },
      data: {
        piiReviewStatus: "acknowledged_safe",
        piiReviewedById: session.userId,
        piiReviewedAt: new Date(),
      },
    });
  });

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "ingested",
      entityType: "document",
      entityId: id,
      metadata: { chunks: chunks.length, embeddingModel: model },
    },
  });

  return NextResponse.json({ status: "indexed", chunks: chunks.length, embeddingModel: model });
});

function maskValue(value: string): string {
  if (value.length <= 4) return "***";
  return `${value.slice(0, 2)}***${value.slice(-2)}`;
}
