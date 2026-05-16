import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { route, paginationFromUrl, searchFromUrl, listMeta } from "@/lib/handler";
import { requireSession } from "@/lib/session";

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);
  const search = searchFromUrl(url);

  const where = {
    hoaId: session.hoaId,
    deletedAt: null,
    ...(search
      ? { OR: [{ address: { contains: search, mode: "insensitive" as const } }, { unitNumber: { contains: search, mode: "insensitive" as const } }] }
      : {}),
  };

  const [rows, totalCount] = await Promise.all([
    prisma.unit.findMany({
      where,
      orderBy: [{ address: "asc" }, { unitNumber: "asc" }],
      skip,
      take,
    }),
    prisma.unit.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map((u) => ({ id: u.id, address: u.address, unitNumber: u.unitNumber })),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});
