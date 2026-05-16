import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError, requireAdmin } from "@/lib/session";
import { route, parseBody } from "@/lib/handler";

const updateSchema = z.object({
  name: z.string().min(1).max(120),
  phone: z.string().nullable().optional(),
  role: z.enum(["resident", "admin"]),
  status: z.enum(["pending", "active", "disabled"]),
  preferredLanguage: z.string().min(2),
});

type UpdateInput = z.infer<typeof updateSchema>;
type Params = { id: string };

export const GET = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const user = await prisma.user.findFirst({
    where: { id, hoaId: session.hoaId, deletedAt: null },
    select: {
      id: true, hoaId: true, email: true, name: true, phone: true,
      role: true, status: true, preferredLanguage: true,
      directoryOptOut: true, emailVerifiedAt: true,
      createdAt: true, updatedAt: true,
    },
  });
  if (!user) throw new ApiError(404, "User not found.");
  return NextResponse.json(serialize(user));
});

export const PATCH = route<Params>(async (req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const input = await parseBody<UpdateInput>(req, updateSchema);

  const existing = await prisma.user.findFirst({
    where: { id, hoaId: session.hoaId, deletedAt: null },
  });
  if (!existing) throw new ApiError(404, "User not found.");

  if (existing.id === session.userId && input.role !== "admin") {
    throw new ApiError(400, "You can't downgrade your own admin role here. Ask another admin.");
  }
  if (existing.id === session.userId && input.status !== "active") {
    throw new ApiError(400, "You can't disable your own account.");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: input.name,
      phone: input.phone ?? null,
      role: input.role,
      status: input.status,
      preferredLanguage: input.preferredLanguage,
    },
    select: {
      id: true, hoaId: true, email: true, name: true, phone: true,
      role: true, status: true, preferredLanguage: true,
      directoryOptOut: true, emailVerifiedAt: true,
      createdAt: true, updatedAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "updated_user",
      entityType: "user",
      entityId: id,
      metadata: { role: updated.role, status: updated.status },
    },
  });

  return NextResponse.json(serialize(updated));
});

export const DELETE = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  if (id === session.userId) {
    throw new ApiError(400, "You can't delete your own account.");
  }
  const existing = await prisma.user.findFirst({
    where: { id, hoaId: session.hoaId, deletedAt: null },
  });
  if (!existing) throw new ApiError(404, "User not found.");

  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date(), status: "disabled" },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "deleted_user",
      entityType: "user",
      entityId: id,
      metadata: {},
    },
  });

  return NextResponse.json({ ok: true });
});

type UserRow = {
  id: string; hoaId: string; email: string; name: string; phone: string | null;
  role: "resident" | "admin"; status: "pending" | "active" | "disabled";
  preferredLanguage: string; directoryOptOut: boolean;
  emailVerifiedAt: Date | null; createdAt: Date; updatedAt: Date;
};

function serialize(r: UserRow) {
  return {
    id: r.id, hoaId: r.hoaId, email: r.email, name: r.name, phone: r.phone,
    role: r.role, status: r.status, preferredLanguage: r.preferredLanguage,
    directoryOptOut: r.directoryOptOut,
    emailVerifiedAt: r.emailVerifiedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
