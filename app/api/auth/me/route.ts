import { NextResponse } from "next/server";
import { route } from "@/lib/handler";
import { requireSession } from "@/lib/session";

export const GET = route(async () => {
  const session = await requireSession();
  return NextResponse.json({
    id: session.userId,
    email: session.email,
    name: session.name,
    role: session.role,
    hoaId: session.hoaId,
  });
});
