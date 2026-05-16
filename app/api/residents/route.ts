import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { route, paginationFromUrl, listMeta } from "@/lib/handler";
import { ApiError, requireSession } from "@/lib/session";

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);

  const hoa = await prisma.hoa.findUnique({ where: { id: session.hoaId } });
  if (!hoa) throw new ApiError(404, "HOA not found.");

  if (hoa.residentDirectoryVisibility === "off") {
    throw new ApiError(403, "Resident directory is disabled for this community.");
  }
  if (hoa.residentDirectoryVisibility === "admins_only" && session.role !== "admin") {
    throw new ApiError(403, "The resident directory is admin-only for this community.");
  }

  const where: Prisma.UserWhereInput = {
    hoaId: session.hoaId,
    status: "active",
    deletedAt: null,
    directoryOptOut: false,
  };

  const [rows, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { name: "asc" },
      skip,
      take,
      select: {
        id: true,
        name: true,
        residencies: {
          where: { endDate: null },
          select: { unit: { select: { address: true, unitNumber: true } } },
          take: 1,
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map((r) => ({
      id: r.id,
      name: r.name,
      unit: r.residencies[0]?.unit
        ? r.residencies[0].unit.unitNumber
          ? `${r.residencies[0].unit.address} #${r.residencies[0].unit.unitNumber}`
          : r.residencies[0].unit.address
        : null,
    })),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});
