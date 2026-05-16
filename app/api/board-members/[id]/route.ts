import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { ApiError, requireSession, requireAdmin } from "@/lib/session";

const updateSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(60),
  email: z.string().email().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  termEnd: z.string().nullable().optional(),
  displayOrder: z.number().int(),
});

type UpdateInput = z.infer<typeof updateSchema>;

type Params = { id: string };

export const GET = route<Params>(async (_req, ctx) => {
  const session = await requireSession();
  const { id } = await ctx.params;
  const row = await prisma.boardMember.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!row) throw new ApiError(404, "Board member not found.");
  return NextResponse.json(serialize(row));
});

export const PATCH = route<Params>(async (req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const input = await parseBody<UpdateInput>(req, updateSchema);

  const existing = await prisma.boardMember.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Board member not found.");

  const row = await prisma.boardMember.update({
    where: { id },
    data: {
      name: input.name,
      role: input.role,
      email: input.email ?? null,
      photoUrl: input.photoUrl ?? null,
      termEnd: input.termEnd ? new Date(input.termEnd) : null,
      displayOrder: input.displayOrder,
    },
  });
  return NextResponse.json(serialize(row));
});

export const DELETE = route<Params>(async (_req, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const existing = await prisma.boardMember.findFirst({ where: { id, hoaId: session.hoaId } });
  if (!existing) throw new ApiError(404, "Board member not found.");
  await prisma.boardMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
});

type BoardMemberRow = {
  id: string; hoaId: string; name: string; role: string;
  email: string | null; photoUrl: string | null;
  termEnd: Date | null; displayOrder: number; createdAt: Date;
};

function serialize(row: BoardMemberRow) {
  return {
    id: row.id, hoaId: row.hoaId, name: row.name, role: row.role,
    email: row.email, photoUrl: row.photoUrl,
    termEnd: row.termEnd?.toISOString().slice(0, 10) ?? null,
    displayOrder: row.displayOrder,
    createdAt: row.createdAt.toISOString(),
  };
}
