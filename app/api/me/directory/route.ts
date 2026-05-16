import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { requireSession } from "@/lib/session";

const schema = z.object({ optOut: z.boolean() });
type Input = z.infer<typeof schema>;

export const PATCH = route(async (req: NextRequest) => {
  const session = await requireSession();
  const { optOut } = await parseBody<Input>(req, schema);
  await prisma.user.update({
    where: { id: session.userId },
    data: { directoryOptOut: optOut },
  });
  return NextResponse.json({ directoryOptOut: optOut });
});
