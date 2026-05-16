import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { route } from "@/lib/handler";
import { ApiError, requireAdmin } from "@/lib/session";

type Params = { id: string };

export const POST = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;

  const existing = await prisma.document.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Document not found.");

  const row = await prisma.document.update({
    where: { id },
    data: {
      piiReviewStatus: "acknowledged_safe",
      piiReviewedById: session.userId,
      piiReviewedAt: new Date(),
    },
    include: { uploadedBy: { select: { id: true, name: true } } },
  });

  return NextResponse.json({
    id: row.id,
    piiReviewStatus: row.piiReviewStatus,
    piiReviewedAt: row.piiReviewedAt?.toISOString() ?? null,
  });
});
