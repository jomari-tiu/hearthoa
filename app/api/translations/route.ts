import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { route, paginationFromUrl, listMeta } from "@/lib/handler";
import { requireSession } from "@/lib/session";

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);
  const reviewed = url.searchParams.get("reviewed");

  const where: Prisma.AnnouncementTranslationWhereInput = {
    hoaId: session.hoaId,
    ...(reviewed === "false" ? { reviewedAt: null } : {}),
    ...(reviewed === "true" ? { reviewedAt: { not: null } } : {}),
  };

  const [rows, totalCount] = await Promise.all([
    prisma.announcementTranslation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        announcement: { select: { id: true, title: true, sourceLanguage: true, priority: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
    }),
    prisma.announcementTranslation.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map((r) => ({
      id: r.id,
      language: r.language,
      title: r.title,
      body: r.body,
      isAutoTranslated: r.isAutoTranslated,
      reviewedBy: r.reviewedBy,
      reviewedAt: r.reviewedAt?.toISOString() ?? null,
      announcement: {
        id: r.announcement.id,
        title: r.announcement.title,
        sourceLanguage: r.announcement.sourceLanguage,
        priority: r.announcement.priority,
      },
      createdAt: r.createdAt.toISOString(),
    })),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});
