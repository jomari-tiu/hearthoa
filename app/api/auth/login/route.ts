import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signSession, ApiError } from "@/lib/session";
import { route, parseBody } from "@/lib/handler";
import { AUTH_COOKIE } from "@/middleware";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginInput = z.infer<typeof loginSchema>;

export const POST = route(async (req: NextRequest) => {
  const { email, password } = await parseBody<LoginInput>(req, loginSchema);

  const user = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      deletedAt: null,
      status: "active",
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = await signSession({
    userId: user.id,
    hoaId: user.hoaId,
    role: user.role,
    email: user.email,
    name: user.name,
  });

  const res = NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });

  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
});
