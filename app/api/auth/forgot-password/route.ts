import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { SignJWT } from "jose";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { sendEmail } from "@/lib/email";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-only-secret-do-not-ship");

const schema = z.object({
  email: z.string().email(),
});

type Input = z.infer<typeof schema>;

export const POST = route(async (req: NextRequest) => {
  const { email } = await parseBody<Input>(req, schema);

  // Always respond OK to avoid email enumeration.
  const user = await prisma.user.findFirst({
    where: { email: email.toLowerCase(), deletedAt: null },
  });

  if (user) {
    const token = await new SignJWT({ sub: user.id, scope: "password-reset" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(SECRET);

    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const link = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your HearthHOA password",
      html: `<p>Click the link below to set a new password. The link expires in 1 hour.</p><p><a href="${link}">${link}</a></p>`,
      text: `Reset your password: ${link}`,
    });
  }

  return NextResponse.json({ ok: true });
});
