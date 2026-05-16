import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ApiError, requireAdmin } from "@/lib/session";
import { route, parseBody } from "@/lib/handler";

const schema = z.object({
  language: z.string().min(2).max(8),
});
type Input = z.infer<typeof schema>;

type Params = { id: string };

export const POST = route<Params>(async (req: NextRequest, ctx) => {
  const session = await requireAdmin();
  const { id } = await ctx.params;
  const { language } = await parseBody<Input>(req, schema);

  const announcement = await prisma.announcement.findFirst({
    where: { id, hoaId: session.hoaId },
  });
  if (!announcement) throw new ApiError(404, "Announcement not found.");
  if (language === announcement.sourceLanguage) {
    throw new ApiError(400, "Target language matches the source.");
  }

  const hoa = await prisma.hoa.findUnique({ where: { id: session.hoaId } });
  if (!hoa) throw new ApiError(404, "HOA not found.");
  if (!hoa.supportedLanguages.includes(language)) {
    throw new ApiError(400, "Language is not enabled for this community.");
  }

  let title = announcement.title;
  let body = announcement.body;
  let isStub = false;

  if (process.env.ANTHROPIC_API_KEY) {
    const sys = `You are a professional translator. Translate the HOA announcement from ${announcement.sourceLanguage} to ${language}. Preserve tone, formatting, times, dates, and numeric values. Return strict JSON with keys "title" and "body". No prose outside JSON.`;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        system: sys,
        messages: [
          {
            role: "user",
            content: JSON.stringify({ title: announcement.title, body: announcement.body }),
          },
        ],
      }),
    });
    if (!res.ok) {
      throw new ApiError(502, `Translation provider error: ${(await res.text()).slice(0, 200)}`);
    }
    const payload = (await res.json()) as { content?: { text?: string }[] };
    const text = payload.content?.[0]?.text ?? "{}";
    try {
      const parsed = JSON.parse(text);
      if (parsed.title) title = parsed.title;
      if (parsed.body) body = parsed.body;
    } catch {
      body = text;
    }
  } else {
    isStub = true;
    title = `[${language}] ${announcement.title}`;
    body = `[Machine-translated stub — set ANTHROPIC_API_KEY for real translation]\n\n${announcement.body}`;
  }

  const translation = await prisma.announcementTranslation.upsert({
    where: { announcementId_language: { announcementId: id, language } },
    update: {
      title,
      body,
      isAutoTranslated: true,
      reviewedById: null,
      reviewedAt: null,
    },
    create: {
      hoaId: session.hoaId,
      announcementId: id,
      language,
      title,
      body,
      isAutoTranslated: true,
    },
  });

  return NextResponse.json({
    id: translation.id,
    language: translation.language,
    title: translation.title,
    body: translation.body,
    reviewed: translation.reviewedAt !== null,
    stub: isStub,
  });
});
