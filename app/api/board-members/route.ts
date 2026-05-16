import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody, paginationFromUrl, listMeta } from "@/lib/handler";
import { requireSession, requireAdmin } from "@/lib/session";

const createSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(60),
  email: z.string().email().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  termEnd: z.string().nullable().optional(),
  displayOrder: z.number().int().default(0),
});

type CreateInput = z.infer<typeof createSchema>;

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);

  const [rows, totalCount] = await Promise.all([
    prisma.boardMember.findMany({
      where: { hoaId: session.hoaId },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      skip,
      take,
    }),
    prisma.boardMember.count({ where: { hoaId: session.hoaId } }),
  ]);

  return NextResponse.json({
    data: rows.map(serialize),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const input = await parseBody<CreateInput>(req, createSchema);

  const row = await prisma.boardMember.create({
    data: {
      hoaId: session.hoaId,
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
