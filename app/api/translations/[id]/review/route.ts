import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, requireAdmin } from "@/lib/session";
import { route } from "@/lib/handler";

type Params = { id: string };

export const POST = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const existing = await prisma.announcementTranslation.findFirst({
    where: { id, hoaId: session.hoaId },
  });
  if (!existing) throw new ApiError(404, "Translation not found.");

  const row = await prisma.announcementTranslation.update({
    where: { id },
    data: {
      reviewedById: session.userId,
      reviewedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "translation_reviewed",
      entityType: "announcement_translation",
      entityId: id,
      metadata: { language: row.language },
    },
  });

  return NextResponse.json({ id: row.id, reviewedAt: row.reviewedAt?.toISOString() ?? null });
});
