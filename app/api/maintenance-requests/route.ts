import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody, paginationFromUrl, searchFromUrl, listMeta } from "@/lib/handler";
import { ApiError, requireSession } from "@/lib/session";

const CATEGORIES = ["landscaping", "plumbing", "electrical", "roads", "pool", "other"] as const;
const STATUSES = ["new", "in_progress", "resolved", "closed"] as const;

const createSchema = z.object({
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(2000),
  category: z.enum(CATEGORIES),
  unitId: z.string().min(1),
  photoUrl: z.string().nullable().optional(),
});

type CreateInput = z.infer<typeof createSchema>;

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);
  const search = searchFromUrl(url);
  const statusParam = url.searchParams.get("status");
  const categoryParam = url.searchParams.get("category");

  // Residents see only their own requests; admins see all in their HOA.
  const where = {
    hoaId: session.hoaId,
    ...(session.role === "resident" ? { submittedById: session.userId } : {}),
    ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }, { description: { contains: search, mode: "insensitive" as const } }] } : {}),
    ...(statusParam && (STATUSES as readonly string[]).includes(statusParam)
      ? { status: statusParam as (typeof STATUSES)[number] }
      : {}),
    ...(categoryParam && (CATEGORIES as readonly string[]).includes(categoryParam)
      ? { category: categoryParam as (typeof CATEGORIES)[number] }
      : {}),
  };

  const [rows, totalCount] = await Promise.all([
    prisma.maintenanceRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        submittedBy: { select: { id: true, name: true } },
        unit: { select: { id: true, address: true, unitNumber: true } },
      },
    }),
    prisma.maintenanceRequest.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map(serialize),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});

export const POST = route(async (req: NextRequest) => {
  const session = await requireSession();
  const input = await parseBody<CreateInput>(req, createSchema);

  const unit = await prisma.unit.findFirst({ where: { id: input.unitId, hoaId: session.hoaId } });
  if (!unit) throw new ApiError(404, "Unit not found in this HOA.");

  const row = await prisma.maintenanceRequest.create({
    data: {
      hoaId: session.hoaId,
      submittedById: session.userId,
      unitId: input.unitId,
      title: input.title,
      description: input.description,
      category: input.category,
      photoUrl: input.photoUrl ?? null,
    },
    include: {
      submittedBy: { select: { id: true, name: true } },
      unit: { select: { id: true, address: true, unitNumber: true } },
    },
  });

  return NextResponse.json(serialize(row));
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
