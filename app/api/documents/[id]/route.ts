import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { ApiError, requireSession, requireAdmin } from "@/lib/session";

const CATEGORIES = ["bylaws", "ccrs", "minutes", "financials", "forms", "other"] as const;

const updateSchema = z.object({
  title: z.string().min(1).max(180),
  category: z.enum(CATEGORIES),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  fileSizeBytes: z.number().int().nonnegative(),
  isChatbotIndexed: z.boolean(),
});

type UpdateInput = z.infer<typeof updateSchema>;
type Params = { id: string };

export const GET = route<Params>(async (_req, ctx) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const row = await prisma.document.findFirst({
    where: { id, hoaId: session.hoaId },
    include: { uploadedBy: { select: { id: true, name: true } } },
  });
  if (!row) throw new ApiError(404, "Document not found.");
  return NextResponse.json(serialize(row));
});

export const PATCH = route<Params>(async (req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const input = await parseBody<UpdateInput>(req, updateSchema);
  const existing = await prisma.document.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Document not found.");

  const row = await prisma.document.update({
    where: { id },
    data: {
      title: input.title,
      category: input.category,
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      fileSizeBytes: BigInt(input.fileSizeBytes),
      isChatbotIndexed: input.isChatbotIndexed,
    },
    include: { uploadedBy: { select: { id: true, name: true } } },
  });
  return NextResponse.json(serialize(row));
});

export const DELETE = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const existing = await prisma.document.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Document not found.");
  await prisma.document.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});

type DocumentRow = {
  id: string; hoaId: string; uploadedById: string;
  uploadedBy: { id: string; name: string } | null;
  title: string;
  category: (typeof CATEGORIES)[number];
  fileUrl: string; fileType: string; fileSizeBytes: bigint;
  version: number; isChatbotIndexed: boolean;
  piiReviewStatus: "pending" | "acknowledged_safe" | "flagged" | "excluded";
  piiReviewedAt: Date | null;
  parentDocumentId: string | null;
  createdAt: Date;
};

function serialize(row: DocumentRow) {
  return {
    id: row.id, hoaId: row.hoaId, uploadedById: row.uploadedById,
    uploadedBy: row.uploadedBy, title: row.title, category: row.category,
    fileUrl: row.fileUrl, fileType: row.fileType,
    fileSizeBytes: Number(row.fileSizeBytes),
    version: row.version, isChatbotIndexed: row.isChatbotIndexed,
    piiReviewStatus: row.piiReviewStatus,
    piiReviewedAt: row.piiReviewedAt?.toISOString() ?? null,
    parentDocumentId: row.parentDocumentId,
    createdAt: row.createdAt.toISOString(),
  };
}
