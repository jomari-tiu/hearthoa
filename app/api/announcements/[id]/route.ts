import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { ApiError, requireSession, requireAdmin } from "@/lib/session";

const updateSchema = z.object({
  title: z.string().min(1).max(140),
  body: z.string().min(1).max(8000),
  priority: z.enum(["general", "critical"]),
  sourceLanguage: z.string().min(2),
  isPinned: z.boolean(),
  pinnedUntil: z.string().nullable().optional(),
});

type UpdateInput = z.infer<typeof updateSchema>;

type Params = { id: string };

export const GET = route<Params>(async (_req, ctx) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const row = await prisma.announcement.findFirst({
    where: { id, hoaId: session.hoaId },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!row) throw new ApiError(404, "Announcement not found.");
  return NextResponse.json(serialize(row));
});

export const PATCH = route<Params>(async (req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const input = await parseBody<UpdateInput>(req, updateSchema);

  const existing = await prisma.announcement.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Announcement not found.");

  const row = await prisma.announcement.update({
    where: { id },
    data: {
      title: input.title,
      body: input.body,
      priority: input.priority,
      sourceLanguage: input.sourceLanguage,
      isPinned: input.isPinned,
      pinnedUntil: input.pinnedUntil ? new Date(input.pinnedUntil) : null,
    },
    include: { author: { select: { id: true, name: true } } },
  });
  return NextResponse.json(serialize(row));
});

export const DELETE = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const existing = await prisma.announcement.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Announcement not found.");
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});

type AnnouncementRow = {
  id: string; hoaId: string; authorId: string;
  author: { id: string; name: string } | null;
  title: string; body: string; imageUrl: string | null;
  priority: "general" | "critical"; sourceLanguage: string;
  isPinned: boolean; pinnedUntil: Date | null;
  publishedAt: Date | null; scheduledFor: Date | null;
  createdAt: Date; updatedAt: Date;
};

function serialize(row: AnnouncementRow) {
  return {
    id: row.id, hoaId: row.hoaId, authorId: row.authorId, author: row.author,
    title: row.title, body: row.body, imageUrl: row.imageUrl,
    priority: row.priority, sourceLanguage: row.sourceLanguage,
    isPinned: row.isPinned,
    pinnedUntil: row.pinnedUntil?.toISOString() ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    scheduledFor: row.scheduledFor?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
