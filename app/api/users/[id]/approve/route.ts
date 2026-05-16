import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { route } from "@/lib/handler";
import { ApiError, requireAdmin } from "@/lib/session";

type Params = { id: string };

export const POST = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;

  const user = await prisma.user.findFirst({ where: { id, hoaId: session.hoaId, deletedAt: null } });
  if (!user) throw new ApiError(404, "User not found.");

  const updated = await prisma.user.update({
    where: { id },
    data: { status: "active", emailVerifiedAt: user.emailVerifiedAt ?? new Date() },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "approved_user",
      entityType: "user",
      entityId: updated.id,
      metadata: {},
    },
  });

  return NextResponse.json({ id: updated.id, status: updated.status });
});
