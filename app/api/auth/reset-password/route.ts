import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/session";
import { route, parseBody } from "@/lib/handler";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-only-secret-do-not-ship");

const schema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

type Input = z.infer<typeof schema>;

export const POST = route(async (req: NextRequest) => {
  const { token, password } = await parseBody<Input>(req, schema);

  let userId: string;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    if (payload.scope !== "password-reset" || typeof payload.sub !== "string") {
      throw new Error("invalid scope");
    }
    userId = payload.sub;
  } catch {
    throw new ApiError(400, "This reset link is invalid or has expired.");
  }

  const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
  if (!user) throw new ApiError(404, "Account not found.");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, emailVerifiedAt: user.emailVerifiedAt ?? new Date() },
  });

  await prisma.auditLog.create({
    data: {
      hoaId: user.hoaId,
      userId: user.id,
      action: "reset_password",
      entityType: "user",
      entityId: user.id,
      metadata: {},
    },
  });

  return NextResponse.json({ ok: true });
});
