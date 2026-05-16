import { NextResponse, type NextRequest } from "next/server";
import Papa from "papaparse";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { ApiError, requireAdmin } from "@/lib/session";
import { route } from "@/lib/handler";

type Row = {
  email?: string;
  name?: string;
  unitAddress?: string;
  unitNumber?: string;
  phone?: string;
  preferredLanguage?: string;
};

type RowResult =
  | { row: number; status: "created"; userId: string; email: string }
  | { row: number; status: "skipped"; reason: string; email?: string }
  | { row: number; status: "error"; reason: string; email?: string };

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
    const rowNum = i + 2; // header + 1

    const email = (row.email ?? "").trim().toLowerCase();
    const name = (row.name ?? "").trim();
    const unitAddress = (row.unitAddress ?? "").trim();
    const unitNumberRaw = (row.unitNumber ?? "").trim();
    const phone = (row.phone ?? "").trim() || null;
    const preferredLanguage = (row.preferredLanguage ?? "").trim();

    if (!email || !email.includes("@")) {
      results.push({ row: rowNum, status: "error", reason: "Missing or invalid email", email });
      continue;
    }
    if (!name) {
      results.push({ row: rowNum, status: "error", reason: "Missing name", email });
      continue;
    }
    if (!unitAddress) {
      results.push({ row: rowNum, status: "error", reason: "Missing unitAddress", email });
      continue;
    }

    try {
      const existing = await prisma.user.findFirst({
        where: { hoaId: session.hoaId, email, deletedAt: null },
      });
      if (existing) {
        results.push({ row: rowNum, status: "skipped", reason: "User already exists", email });
        continue;
      }

      const unit = await prisma.unit.upsert({
        where: { id: `nothing` } as never,
        update: {},
        create: { hoaId: session.hoaId, address: unitAddress, unitNumber: unitNumberRaw || null },
      }).catch(async () => {
        const found = await prisma.unit.findFirst({
          where: { hoaId: session.hoaId, address: unitAddress, unitNumber: unitNumberRaw || null },
        });
        if (found) return found;
        return prisma.unit.create({
          data: { hoaId: session.hoaId, address: unitAddress, unitNumber: unitNumberRaw || null },
        });
      });

      const tempPassword = crypto.randomBytes(8).toString("hex");
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      const user = await prisma.user.create({
        data: {
          hoaId: session.hoaId,
          email,
          passwordHash,
          name,
          phone,
          role: "resident",
          status: "pending",
          preferredLanguage: preferredLanguage || "en",
        },
      });

      await prisma.unitResident.create({
        data: {
          hoaId: session.hoaId,
          unitId: unit.id,
          userId: user.id,
          startDate: new Date(),
          isPrimary: true,
        },
      });

      created += 1;
      results.push({ row: rowNum, status: "created", userId: user.id, email });
    } catch (error) {
      results.push({
        row: rowNum,
        status: "error",
        reason: error instanceof Error ? error.message : "Unknown error",
        email,
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "bulk_imported_residents",
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
