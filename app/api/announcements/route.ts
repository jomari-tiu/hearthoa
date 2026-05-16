import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody, paginationFromUrl, searchFromUrl, listMeta } from "@/lib/handler";
import { requireSession, requireAdmin } from "@/lib/session";

const createSchema = z.object({
  title: z.string().min(1).max(140),
  body: z.string().min(1).max(8000),
  priority: z.enum(["general", "critical"]),
  sourceLanguage: z.string().min(2),
  isPinned: z.boolean().default(false),
  pinnedUntil: z.string().nullable().optional(),
});

type CreateInput = z.infer<typeof createSchema>;

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);
  const search = searchFromUrl(url);
  const priorityParam = url.searchParams.get("priority");

  const where: Prisma.AnnouncementWhereInput = {
    hoaId: session.hoaId,
    ...(search ? { OR: [{ title: { contains: search, mode: "insensitive" } }, { body: { contains: search, mode: "insensitive" } }] } : {}),
    ...(priorityParam === "critical" || priorityParam === "general"
      ? { priority: priorityParam as "critical" | "general" }
      : {}),
  };

  const [rows, totalCount] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take,
      include: { author: { select: { id: true, name: true } } },
    }),
    prisma.announcement.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map(serialize),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const input = await parseBody<CreateInput>(req, createSchema);

  const row = await prisma.announcement.create({
    data: {
      hoaId: session.hoaId,
      authorId: session.userId,
      title: input.title,
      body: input.body,
      priority: input.priority,
      sourceLanguage: input.sourceLanguage,
      isPinned: input.isPinned,
      pinnedUntil: input.pinnedUntil ? new Date(input.pinnedUntil) : null,
      publishedAt: new Date(),
    },
    include: { author: { select: { id: true, name: true } } },
  });

  return NextResponse.json(serialize(row));
});

type AnnouncementRow = Prisma.AnnouncementGetPayload<{
  include: { author: { select: { id: true; name: true } } };
}>;

function serialize(row: AnnouncementRow) {
  return {
    id: row.id,
    hoaId: row.hoaId,
    authorId: row.authorId,
    author: row.author,
    title: row.title,
    body: row.body,
    imageUrl: row.imageUrl,
    priority: row.priority,
    sourceLanguage: row.sourceLanguage,
    isPinned: row.isPinned,
    pinnedUntil: row.pinnedUntil?.toISOString() ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    scheduledFor: row.scheduledFor?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
