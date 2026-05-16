import { NextResponse, type NextRequest } from "next/server";
import Papa from "papaparse";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { ApiError, requireAdmin } from "@/lib/session";
import { route } from "@/lib/handler";

type Row = {
  unitAddress?: string;
  unitNumber?: string;
  period?: string;
  amountCents?: string;
  dueDate?: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
};

type RowResult =
  | { row: number; status: "created"; dueId: string }
  | { row: number; status: "skipped"; reason: string }
  | { row: number; status: "error"; reason: string };

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new ApiError(400, "Attach a CSV file under 'file'.");

  const text = await file.text();
  const parsed = Papa.parse<Row>(text, { header: true, skipEmptyLines: true, transformHeader: (h) => h.trim() });
  if (parsed.errors.length > 0) {
    const first = parsed.errors[0];
    throw new ApiError(400, `CSV parse error at row ${first?.row ?? "?"}: ${first?.message ?? "unknown"}`);
  }

  const results: RowResult[] = [];
  let created = 0;

  for (let i = 0; i < parsed.data.length; i++) {
    const row = parsed.data[i];
    if (!row) continue;
    const rowNum = i + 2;

    const unitAddress = (row.unitAddress ?? "").trim();
    const unitNumber = (row.unitNumber ?? "").trim() || null;
    const period = (row.period ?? "").trim();
    const amountStr = (row.amountCents ?? "").trim();
    const dueDateStr = (row.dueDate ?? "").trim();

    if (!unitAddress) {
      results.push({ row: rowNum, status: "error", reason: "Missing unitAddress" });
      continue;
    }
    if (!period || !/^\d{4}-\d{2}$/.test(period)) {
      results.push({ row: rowNum, status: "error", reason: "Period must be YYYY-MM" });
      continue;
    }
    const amountCents = Number(amountStr);
    if (!Number.isFinite(amountCents) || amountCents < 0 || !Number.isInteger(amountCents)) {
      results.push({ row: rowNum, status: "error", reason: "amountCents must be a non-negative integer" });
      continue;
    }
    if (!dueDateStr) {
      results.push({ row: rowNum, status: "error", reason: "Missing dueDate" });
      continue;
    }

    try {
      const unit = await prisma.unit.findFirst({
        where: { hoaId: session.hoaId, address: unitAddress, unitNumber, deletedAt: null },
      });
      if (!unit) {
        results.push({ row: rowNum, status: "error", reason: `Unit not found: ${unitAddress} ${unitNumber ?? ""}` });
        continue;
      }

      const existing = await prisma.due.findFirst({
        where: { hoaId: session.hoaId, unitId: unit.id, period },
      });
      if (existing) {
        results.push({ row: rowNum, status: "skipped", reason: "Due for this unit + period already exists" });
        continue;
      }

      const due = await prisma.due.create({
        data: {
          hoaId: session.hoaId,
          unitId: unit.id,
          period,
          amountCents,
          dueDate: new Date(dueDateStr),
          notes: row.notes?.trim() || null,
        },
      });

      // Optional payment attached on the same row.
      const paidAt = row.paidAt?.trim();
      const methodStr = row.paymentMethod?.trim()?.toLowerCase();
      const allowedMethods = ["cash", "check", "transfer", "card", "ach", "waiver"] as const;
      if (paidAt && methodStr && (allowedMethods as readonly string[]).includes(methodStr)) {
        const payment = await prisma.payment.create({
          data: {
            hoaId: session.hoaId,
            paidByUserId: null,
            amountCents,
            method: methodStr as (typeof allowedMethods)[number],
            reference: row.paymentReference?.trim() || null,
            paidAt: new Date(paidAt),
            recordedByUserId: session.userId,
          },
        });
        await prisma.duePayment.create({
          data: { dueId: due.id, paymentId: payment.id, allocatedCents: amountCents },
        });
        await prisma.due.update({ where: { id: due.id }, data: { status: "paid" } });
      }

      created += 1;
      results.push({ row: rowNum, status: "created", dueId: due.id });
    } catch (error) {
      results.push({
        row: rowNum,
        status: "error",
        reason: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "bulk_imported_dues",
      entityType: "import",
      entityId: crypto.randomUUID(),
      metadata: { created, totalRows: parsed.data.length },
    },
  });

  return NextResponse.json({
    summary: {
      total: parsed.data.length,
      created,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
    },
    results,
  });
});
