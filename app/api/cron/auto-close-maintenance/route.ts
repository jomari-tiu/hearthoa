import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const result = await prisma.maintenanceRequest.updateMany({
    where: { status: "resolved", resolvedAt: { lt: cutoff } },
    data: { status: "closed", closedAt: new Date() },
  });
  return NextResponse.json({ closed: result.count });
}

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return process.env.NODE_ENV !== "production";
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}
