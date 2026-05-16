import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel/cron-friendly endpoint. Protect with a shared secret in the cron config.
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }
  const result = await prisma.announcement.updateMany({
    where: { isPinned: true, pinnedUntil: { lt: new Date() } },
    data: { isPinned: false },
  });
  return NextResponse.json({ unpinned: result.count });
}

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return process.env.NODE_ENV !== "production";
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}
