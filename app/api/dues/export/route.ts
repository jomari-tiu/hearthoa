import { NextResponse, type NextRequest } from "next/server";
import Papa from "papaparse";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { route } from "@/lib/handler";
import { requireAdmin } from "@/lib/session";

export const GET = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const unitId = url.searchParams.get("unitId");
  const status = url.searchParams.get("status");

  const where: Prisma.DueWhereInput = {
    hoaId: session.hoaId,
    ...(from || to
      ? {
          dueDate: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(to) } : {}),
          },
        }
      : {}),
    ...(unitId ? { unitId } : {}),
    ...(status === "unpaid" || status === "partial" || status === "paid" || status === "late" || status === "waived"
      ? { status }
      : {}),
  };

  const dues = await prisma.due.findMany({
    where,
    orderBy: [{ unitId: "asc" }, { dueDate: "asc" }],
    include: {
      unit: { select: { address: true, unitNumber: true } },
      allocations: { include: { payment: true } },
    },
  });

  const balanceByUnit = new Map<string, number>();
  const rows = dues.map((d) => {
    const allocated = d.allocations.reduce((s, a) => s + a.allocatedCents, 0);
    const balance = d.amountCents - allocated;
    const prev = balanceByUnit.get(d.unitId) ?? 0;
    const runningBalance = prev + balance;
    balanceByUnit.set(d.unitId, runningBalance);
    return {
      unitAddress: d.unit?.address ?? "",
      unitNumber: d.unit?.unitNumber ?? "",
      period: d.period,
      dueDate: d.dueDate.toISOString().slice(0, 10),
      amountCents: d.amountCents,
      allocatedCents: allocated,
      balanceCents: balance,
      runningBalanceCents: runningBalance,
      status: d.status,
      notes: d.notes ?? "",
    };
  });

  const csv = Papa.unparse(rows);
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="dues-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
});
