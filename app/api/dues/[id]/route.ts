import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { ApiError, requireSession, requireAdmin } from "@/lib/session";

const updateSchema = z.object({
  unitId: z.string().min(1),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  amountCents: z.number().int().nonnegative(),
  dueDate: z.string().min(1),
  notes: z.string().nullable().optional(),
});

type UpdateInput = z.infer<typeof updateSchema>;
type Params = { id: string };

export const GET = route<Params>(async (_req, ctx) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const row = await prisma.due.findFirst({
    where: { id, hoaId: session.hoaId },
    include: {
      unit: { select: { id: true, address: true, unitNumber: true } },
      allocations: { include: { payment: true } },
    },
  });
  if (!row) throw new ApiError(404, "Due not found.");
  return NextResponse.json(serialize(row));
});

export const PATCH = route<Params>(async (req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const input = await parseBody<UpdateInput>(req, updateSchema);

  const existing = await prisma.due.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Due not found.");

  const row = await prisma.due.update({
    where: { id },
    data: {
      unitId: input.unitId,
      period: input.period,
      amountCents: input.amountCents,
      dueDate: new Date(input.dueDate),
      notes: input.notes ?? null,
    },
    include: {
      unit: { select: { id: true, address: true, unitNumber: true } },
      allocations: { include: { payment: true } },
    },
  });
  return NextResponse.json(serialize(row));
});

export const DELETE = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const existing = await prisma.due.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Due not found.");
  await prisma.duePayment.deleteMany({ where: { dueId: id } });
  await prisma.due.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});

type DueRow = {
  id: string; hoaId: string; unitId: string;
  unit: { id: string; address: string; unitNumber: string | null } | null;
  period: string; amountCents: number;
  dueDate: Date;
  status: "unpaid" | "partial" | "paid" | "late" | "waived";
  notes: string | null;
  allocations: Array<{
    id: string; paymentId: string; allocatedCents: number;
    payment: {
      id: string; amountCents: number;
      method: "cash" | "check" | "transfer" | "card" | "ach" | "waiver";
      paidAt: Date; reference: string | null;
    };
  }>;
  createdAt: Date; updatedAt: Date;
};

function serialize(row: DueRow) {
  return {
    id: row.id, hoaId: row.hoaId, unitId: row.unitId, unit: row.unit,
    period: row.period, amountCents: row.amountCents,
    dueDate: row.dueDate.toISOString().slice(0, 10),
    status: row.status, notes: row.notes,
    allocations: row.allocations.map((a) => ({
      id: a.id, paymentId: a.paymentId, allocatedCents: a.allocatedCents,
      payment: {
        id: a.payment.id, amountCents: a.payment.amountCents,
        method: a.payment.method,
        paidAt: a.payment.paidAt.toISOString(),
        reference: a.payment.reference,
      },
    })),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
