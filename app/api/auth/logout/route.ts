import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/middleware";
import { route } from "@/lib/handler";

export const POST = route(async () => {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(AUTH_COOKIE);
  return res;
});
