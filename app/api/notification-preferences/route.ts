import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { requireSession } from "@/lib/session";

const DEFAULT_TYPES = [
  "new_announcement",
  "request_status_change",
  "dues_reminder",
  "account_approval",
  "weekly_digest",
] as const;

export type TPreferenceType = (typeof DEFAULT_TYPES)[number];

const updateSchema = z.object({
  preferences: z
    .array(
      z.object({
        type: z.string(),
        emailEnabled: z.boolean(),
      }),
    )
    .min(1),
});

type UpdateInput = z.infer<typeof updateSchema>;

export const GET = route(async () => {
  const session = await requireSession();
  const rows = await prisma.userNotificationPreference.findMany({
    where: { userId: session.userId },
  });
  const byType = new Map(rows.map((r) => [r.type, r.emailEnabled]));
  const data = DEFAULT_TYPES.map((type) => ({
    type,
    emailEnabled: byType.get(type) ?? defaultFor(type),
  }));
  return NextResponse.json({ data });
});

export const PATCH = route(async (req: NextRequest) => {
  const session = await requireSession();
  const { preferences } = await parseBody<UpdateInput>(req, updateSchema);

  await prisma.$transaction(
    preferences.map((p) =>
      prisma.userNotificationPreference.upsert({
        where: { userId_type: { userId: session.userId, type: p.type } },
        update: { emailEnabled: p.emailEnabled },
        create: { userId: session.userId, type: p.type, emailEnabled: p.emailEnabled },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
});

function defaultFor(type: string): boolean {
  // Digest types default off, transactional on.
  if (type === "weekly_digest") return false;
  return true;
}
