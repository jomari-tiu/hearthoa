import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/session";
import { route, parseBody } from "@/lib/handler";

const registerSchema = z.object({
  hoaSlug: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120),
  phone: z.string().nullable().optional(),
  unitAddress: z.string().min(1),
  unitNumber: z.string().nullable().optional(),
  preferredLanguage: z.string().min(2).optional(),
});

type RegisterInput = z.infer<typeof registerSchema>;

export const POST = route(async (req: NextRequest) => {
  const input = await parseBody<RegisterInput>(req, registerSchema);

  const hoa = await prisma.hoa.findUnique({ where: { slug: input.hoaSlug } });
  if (!hoa) throw new ApiError(404, "We couldn't find that community.");

  const email = input.email.toLowerCase();
  const existing = await prisma.user.findFirst({
    where: { hoaId: hoa.id, email, deletedAt: null },
  });
  if (existing) {
    throw new ApiError(409, "An account with that email already exists in this community.");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      hoaId: hoa.id,
      email,
      passwordHash,
      name: input.name,
      phone: input.phone ?? null,
      role: "resident",
      status: "pending",
      preferredLanguage: input.preferredLanguage ?? hoa.defaultLanguage,
    },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: hoa.id,
      userId: user.id,
      action: "registered",
      entityType: "user",
      entityId: user.id,
      metadata: { unitAddress: input.unitAddress, unitNumber: input.unitNumber ?? null },
    },
  });

  return NextResponse.json({
    message: "Account submitted. An admin will approve you shortly.",
    userId: user.id,
  });
});
