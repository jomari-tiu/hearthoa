import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const result = await prisma.due.updateMany({
    where: {
      status: { in: ["unpaid", "partial"] },
      dueDate: { lt: today },
    },
    data: { status: "late" },
  });
  return NextResponse.json({ updated: result.count });
}

function authorized(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return process.env.NODE_ENV !== "production";
  const header = req.headers.get("authorization");
  return header === `Bearer ${expected}`;
}
