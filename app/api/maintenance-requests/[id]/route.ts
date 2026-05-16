import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { ApiError, requireSession } from "@/lib/session";

const CATEGORIES = ["landscaping", "plumbing", "electrical", "roads", "pool", "other"] as const;
const STATUSES = ["new", "in_progress", "resolved", "closed"] as const;

const updateSchema = z.object({
  title: z.string().min(1).max(140).optional(),
  description: z.string().min(1).max(2000).optional(),
  category: z.enum(CATEGORIES).optional(),
  unitId: z.string().min(1).optional(),
  photoUrl: z.string().nullable().optional(),
  status: z.enum(STATUSES).optional(),
  assignedTo: z.string().nullable().optional(),
  adminNotes: z.string().nullable().optional(),
});

type UpdateInput = z.infer<typeof updateSchema>;
type Params = { id: string };

export const GET = route<Params>(async (_req, ctx) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const row = await prisma.maintenanceRequest.findFirst({
    where: {
      id,
      hoaId: session.hoaId,
      ...(session.role === "resident" ? { submittedById: session.userId } : {}),
    },
    include: {
      submittedBy: { select: { id: true, name: true } },
      unit: { select: { id: true, address: true, unitNumber: true } },
    },
  });
  if (!row) throw new ApiError(404, "Request not found.");
  return NextResponse.json(serialize(row));
});

export const PATCH = route<Params>(async (req, ctx) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const input = await parseBody<UpdateInput>(req, updateSchema);

  const existing = await prisma.maintenanceRequest.findFirst({
    where: {
      id,
      hoaId: session.hoaId,
      ...(session.role === "resident" ? { submittedById: session.userId } : {}),
    },
  });
  if (!existing) throw new ApiError(404, "Request not found.");

  if (session.role === "resident" && (input.status || input.assignedTo !== undefined || input.adminNotes !== undefined)) {
    throw new ApiError(403, "Residents can only edit their request's title, description, category, or photo.");
  }

  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.description !== undefined) data.description = input.description;
  if (input.category !== undefined) data.category = input.category;
  if (input.unitId !== undefined) data.unitId = input.unitId;
  if (input.photoUrl !== undefined) data.photoUrl = input.photoUrl;
  if (input.status !== undefined) {
    data.status = input.status;
    if (input.status === "resolved") data.resolvedAt = new Date();
    if (input.status === "closed") data.closedAt = new Date();
  }
  if (input.assignedTo !== undefined) data.assignedTo = input.assignedTo;
  if (input.adminNotes !== undefined) data.adminNotes = input.adminNotes;

  const row = await prisma.maintenanceRequest.update({
    where: { id },
    data,
    include: {
      submittedBy: { select: { id: true, name: true } },
      unit: { select: { id: true, address: true, unitNumber: true } },
    },
  });
  return NextResponse.json(serialize(row));
});

export const DELETE = route<Params>(async (_req, ctx) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const existing = await prisma.maintenanceRequest.findFirst({
    where: {
      id,
      hoaId: session.hoaId,
      ...(session.role === "resident" ? { submittedById: session.userId } : {}),
    },
  });
  if (!existing) throw new ApiError(404, "Request not found.");
  await prisma.maintenanceRequest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});

type RequestRow = {
  id: string; hoaId: string; submittedById: string; unitId: string;
  submittedBy: { id: string; name: string } | null;
  unit: { id: string; address: string; unitNumber: string | null } | null;
  title: string; description: string;
  category: (typeof CATEGORIES)[number];
  photoUrl: string | null;
  status: (typeof STATUSES)[number];
  assignedTo: string | null; adminNotes: string | null;
  resolvedAt: Date | null; closedAt: Date | null;
  createdAt: Date; updatedAt: Date;
};

function serialize(row: RequestRow) {
  return {
    id: row.id, hoaId: row.hoaId,
    submittedById: row.submittedById, submittedBy: row.submittedBy,
    unitId: row.unitId, unit: row.unit,
    title: row.title, description: row.description,
    category: row.category, photoUrl: row.photoUrl,
    status: row.status, assignedTo: row.assignedTo, adminNotes: row.adminNotes,
    resolvedAt: row.resolvedAt?.toISOString() ?? null,
    closedAt: row.closedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
