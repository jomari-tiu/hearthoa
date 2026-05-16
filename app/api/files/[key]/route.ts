import { NextResponse } from "next/server";
import { readFile } from "@/lib/storage";
import { ApiError, requireSession } from "@/lib/session";
import { route } from "@/lib/handler";

type Params = { key: string };

export const GET = route<Params>(async (_req, ctx) => {
  await requireSession();
  const { key } = await ctx.params;
  const decoded = decodeURIComponent(key);
  try {
    const buf = await readFile(decoded);
    return new NextResponse(buf as unknown as BodyInit, {
      headers: {
        "content-disposition": `inline; filename="${decoded.split("/").pop()}"`,
      },
    });
  } catch {
    throw new ApiError(404, "File not found.");
  }
});
