import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody } from "@/lib/handler";
import { ApiError, requireSession } from "@/lib/session";

const schema = z.object({
  question: z.string().min(1).max(1000),
  sessionId: z.string().nullable().optional(),
});

type Input = z.infer<typeof schema>;

export const POST = route(async (req: NextRequest) => {
  const session = await requireSession();
  const { question, sessionId } = await parseBody<Input>(req, schema);

  const hoa = await prisma.hoa.findUnique({ where: { id: session.hoaId } });
  if (!hoa) throw new ApiError(404, "HOA not found.");

  // Rate limit: count today's user messages for this resident.
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const usedToday = await prisma.chatMessage.count({
    where: {
      hoaId: session.hoaId,
      userId: session.userId,
      role: "user",
      createdAt: { gte: today },
    },
  });
  if (usedToday >= hoa.aiPerUserDailyMessages) {
    throw new ApiError(429, "You've reached today's chatbot limit. Please try again tomorrow or contact the board.");
  }

  // Get or create session.
  let chatSessionId = sessionId ?? null;
  if (chatSessionId) {
    const existing = await prisma.chatSession.findFirst({
      where: { id: chatSessionId, hoaId: session.hoaId, userId: session.userId },
    });
    if (!existing) chatSessionId = null;
  }
  if (!chatSessionId) {
    const created = await prisma.chatSession.create({
      data: { hoaId: session.hoaId, userId: session.userId },
    });
    chatSessionId = created.id;
  }

  await prisma.chatMessage.create({
    data: {
      hoaId: session.hoaId,
      sessionId: chatSessionId,
      userId: session.userId,
      role: "user",
      content: question,
    },
  });

  // Real retrieval would: embed question → search document_chunks → call LLM with chunks.
  // Until ingestion is wired, return a grounded fallback that respects the safety contract.
  const answer = process.env.ANTHROPIC_API_KEY
    ? "Document ingestion is being set up for your community. Once your HOA's CC&Rs and bylaws are indexed (Sprint 8), I'll cite the exact section for every answer."
    : "I couldn't find this in our HOA documents — please contact the board.";

  const assistantMsg = await prisma.chatMessage.create({
    data: {
      hoaId: session.hoaId,
      sessionId: chatSessionId,
      role: "assistant",
      content: answer,
      tokensIn: question.length,
      tokensOut: answer.length,
      costCents: 0,
    },
  });

  return NextResponse.json({
    sessionId: chatSessionId,
    messageId: assistantMsg.id,
    answer,
    citations: [],
    remainingToday: Math.max(0, hoa.aiPerUserDailyMessages - usedToday - 1),
  });
});
