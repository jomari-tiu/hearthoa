import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { ApiError, requireAdmin } from "@/lib/session";

const schema = z.object({
  prompt: z.string().min(1).max(2000),
  tone: z.enum(["friendly", "formal", "urgent"]).default("friendly"),
  length: z.enum(["short", "standard", "detailed"]).default("standard"),
});

type Input = z.infer<typeof schema>;

const TONE_GUIDANCE: Record<Input["tone"], string> = {
  friendly: "Warm and approachable, like a neighbor.",
  formal: "Respectful and businesslike, suitable for legal or financial topics.",
  urgent: "Direct and serious; do not bury the lede.",
};

const LENGTH_GUIDANCE: Record<Input["length"], string> = {
  short: "Aim for under 60 words. SMS-friendly.",
  standard: "2–3 short paragraphs.",
  detailed: "Up to 6 paragraphs with specifics like times, locations, contacts.",
};

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const { prompt, tone, length } = await parseBody<Input>(req, schema);

  const hoa = await prisma.hoa.findUnique({ where: { id: session.hoaId } });
  if (!hoa) throw new ApiError(404, "HOA not found.");

  await checkBudget(session.hoaId, hoa.aiMonthlyBudgetCents);

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      title: stubTitle(prompt),
      body: stubBody(prompt, tone, length),
      stubbed: true,
    });
  }

  const systemPrompt = `You are an HOA communications assistant for ${hoa.name}. Write a clear announcement.
Tone: ${TONE_GUIDANCE[tone]}
Length: ${LENGTH_GUIDANCE[length]}
Return strict JSON: {"title": string, "body": string}. No prose outside JSON.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(502, `AI provider error: ${text.slice(0, 200)}`);
  }

  const payload = (await res.json()) as {
    content?: { text?: string }[];
    usage?: { input_tokens?: number; output_tokens?: number };
  };
  const text = payload.content?.[0]?.text ?? "{}";
  let parsed: { title?: string; body?: string };
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { title: stubTitle(prompt), body: text };
  }

  await prisma.auditLog.create({
    data: {
      hoaId: session.hoaId,
      userId: session.userId,
      action: "ai_draft",
      entityType: "announcement_draft",
      entityId: crypto.randomUUID(),
      metadata: { tone, length, inputTokens: payload.usage?.input_tokens, outputTokens: payload.usage?.output_tokens },
    },
  });

  return NextResponse.json({
    title: parsed.title ?? stubTitle(prompt),
    body: parsed.body ?? "",
  });
});

async function checkBudget(hoaId: string, budgetCents: number) {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const agg = await prisma.chatMessage.aggregate({
    _sum: { costCents: true },
    where: { hoaId, createdAt: { gte: monthStart } },
  });
  const spent = agg._sum.costCents ?? 0;
  if (spent >= budgetCents) {
    throw new ApiError(429, "Monthly AI budget reached. Ask your board to raise the cap.");
  }
}

function stubTitle(prompt: string): string {
  const firstLine = prompt.split(/[.\n]/)[0] ?? prompt;
  return firstLine.length > 80 ? firstLine.slice(0, 77) + "…" : firstLine;
}

function stubBody(prompt: string, tone: Input["tone"], length: Input["length"]): string {
  const lead =
    tone === "urgent"
      ? "Heads up — quick update for everyone:"
      : tone === "formal"
        ? "Dear residents,"
        : "Hi neighbors —";
  const closer =
    tone === "formal"
      ? "Please contact the board with any questions.\n\nRegards,\nThe Board"
      : "Reply to this email if you have questions.";
  const middle =
    length === "short"
      ? prompt
      : length === "detailed"
        ? `${prompt}\n\nIf this affects your unit specifically, the board will follow up directly within 48 hours. We appreciate your patience and your role in keeping this community great.`
        : `${prompt}\n\nThanks in advance for keeping this community running smoothly.`;
  return `${lead}\n\n${middle}\n\n${closer}`;
}
