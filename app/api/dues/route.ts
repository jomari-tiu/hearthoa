import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody, paginationFromUrl, listMeta } from "@/lib/handler";
import { ApiError, requireSession, requireAdmin } from "@/lib/session";

const STATUSES = ["unpaid", "partial", "paid", "late", "waived"] as const;

const createSchema = z.object({
  unitId: z.string().min(1),
  period: z.string().regex(/^\d{4}-\d{2}$/),
  amountCents: z.number().int().nonnegative(),
  dueDate: z.string().min(1),
  notes: z.string().nullable().optional(),
});

type CreateInput = z.infer<typeof createSchema>;

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);
  const statusParam = url.searchParams.get("status");
  const unitId = url.searchParams.get("unitId");
  const period = url.searchParams.get("period");

  const where = {
    hoaId: session.hoaId,
    ...(statusParam && (STATUSES as readonly string[]).includes(statusParam)
      ? { status: statusParam as (typeof STATUSES)[number] }
      : {}),
    ...(unitId ? { unitId } : {}),
    ...(period ? { period } : {}),
  };

  const [rows, totalCount] = await Promise.all([
    prisma.due.findMany({
      where,
      orderBy: [{ period: "desc" }, { dueDate: "desc" }],
      skip,
      take,
      include: {
        unit: { select: { id: true, address: true, unitNumber: true } },
        allocations: { include: { payment: true } },
      },
    }),
    prisma.due.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map(serialize),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const input = await parseBody<CreateInput>(req, createSchema);

  const unit = await prisma.unit.findFirst({ where: { id: input.unitId, hoaId: session.hoaId } });
  if (!unit) throw new ApiError(404, "Unit not found in this HOA.");

  const row = await prisma.due.create({
    data: {
      hoaId: session.hoaId,
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

type DueRow = {
  id: string; hoaId: string; unitId: string;
  unit: { id: string; address: string; unitNumber: string | null } | null;
  period: string; amountCents: number;
  dueDate: Date;
  status: (typeof STATUSES)[number];
  notes: string | null;
  allocations: Array<{
    id: string;
    paymentId: string;
    allocatedCents: number;
    payment: {
      id: string;
      amountCents: number;
      method: "cash" | "check" | "transfer" | "card" | "ach" | "waiver";
      paidAt: Date;
      reference: string | null;
    };
  }>;
  createdAt: Date; updatedAt: Date;
};

function serialize(row: DueRow) {
  return {
    id: row.id,
    hoaId: row.hoaId,
    unitId: row.unitId,
    unit: row.unit,
    period: row.period,
    amountCents: row.amountCents,
    dueDate: row.dueDate.toISOString().slice(0, 10),
    status: row.status,
    notes: row.notes,
    allocations: row.allocations.map((a) => ({
      id: a.id,
      paymentId: a.paymentId,
      allocatedCents: a.allocatedCents,
      payment: {
        id: a.payment.id,
        amountCents: a.payment.amountCents,
        method: a.payment.method,
        paidAt: a.payment.paidAt.toISOString(),
        reference: a.payment.reference,
      },
    })),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
