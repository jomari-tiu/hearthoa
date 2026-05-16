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

  await prisma.user.update({
    where: { id },
    data: { status: "disabled" },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "rejected_user",
      entityType: "user",
      entityId: id,
      metadata: {},
    },
  });

  return NextResponse.json({ ok: true });
});
