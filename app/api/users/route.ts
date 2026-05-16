import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { route, parseBody, paginationFromUrl, searchFromUrl, listMeta } from "@/lib/handler";
import { ApiError, requireAdmin } from "@/lib/session";

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120),
  phone: z.string().nullable().optional(),
  role: z.enum(["resident", "admin"]),
  preferredLanguage: z.string().min(2).default("en"),
});

type CreateInput = z.infer<typeof createSchema>;

export const GET = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);
  const search = searchFromUrl(url);
  const statusParam = url.searchParams.get("status");
  const roleParam = url.searchParams.get("role");

  const where: Prisma.UserWhereInput = {
    hoaId: session.hoaId,
    deletedAt: null,
    ...(search
      ? { OR: [{ email: { contains: search, mode: "insensitive" } }, { name: { contains: search, mode: "insensitive" } }] }
      : {}),
    ...(statusParam === "pending" || statusParam === "active" || statusParam === "disabled"
      ? { status: statusParam }
      : {}),
    ...(roleParam === "resident" || roleParam === "admin" ? { role: roleParam } : {}),
  };

  const [rows, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true, hoaId: true, email: true, name: true, phone: true,
        role: true, status: true, preferredLanguage: true,
        directoryOptOut: true, emailVerifiedAt: true,
        createdAt: true, updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map(serialize),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const input = await parseBody<CreateInput>(req, createSchema);

  const email = input.email.toLowerCase();
  const existing = await prisma.user.findFirst({
    where: { hoaId: session.hoaId, email, deletedAt: null },
  });
  if (existing) throw new ApiError(409, "A user with that email already exists in this community.");

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      hoaId: session.hoaId,
      email,
      passwordHash,
      name: input.name,
      phone: input.phone ?? null,
      role: input.role,
      status: "active",
      preferredLanguage: input.preferredLanguage,
      emailVerifiedAt: new Date(),
    },
    select: {
      id: true, hoaId: true, email: true, name: true, phone: true,
      role: true, status: true, preferredLanguage: true,
      directoryOptOut: true, emailVerifiedAt: true,
      createdAt: true, updatedAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "created_user",
      entityType: "user",
      entityId: user.id,
      metadata: { role: user.role },
    },
  });

  return NextResponse.json(serialize(user));
});

type UserRow = {
  id: string;
  hoaId: string;
  email: string;
  name: string;
  phone: string | null;
  role: "resident" | "admin";
  status: "pending" | "active" | "disabled";
  preferredLanguage: string;
  directoryOptOut: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

function serialize(r: UserRow) {
  return {
    id: r.id,
    hoaId: r.hoaId,
    email: r.email,
    name: r.name,
    phone: r.phone,
    role: r.role,
    status: r.status,
    preferredLanguage: r.preferredLanguage,
    directoryOptOut: r.directoryOptOut,
    emailVerifiedAt: r.emailVerifiedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}
