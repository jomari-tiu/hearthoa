"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ExternalLink, ThumbsUp, ThumbsDown, ShieldAlert } from "lucide-react";
import { Button, Badge, Input } from "@/components/ds";
import { api, extractErrorMessages } from "@/lib/api";
import { cn } from "@/lib/utils";

type Citation = { documentId: string; documentTitle: string; page?: number; section?: string };
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  feedback?: "positive" | "negative";
};

const STARTER_QUESTIONS = [
  "What are the pool hours?",
  "Can I paint my front door?",
  "What's the pet policy?",
  "When are board meetings?",
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    try {
      const res = await api.post<{
        sessionId: string;
        messageId: string;
        answer: string;
        citations: Citation[];
      }>("/ai/chat", { question: text, sessionId });
      setSessionId(res.data.sessionId);
      setMessages((prev) => [
        ...prev,
        {
          id: res.data.messageId,
          role: "assistant",
          content: res.data.answer,
          citations: res.data.citations,
        },
      ]);
    } catch (error) {
      const [message] = extractErrorMessages(error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: message ?? "I ran into a problem. Try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function rate(id: string, tone: "positive" | "negative") {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback: tone } : m)));
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open chatbot"
        className={cn(
          "fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 h-11 rounded-pill bg-primary text-primary-fg shadow-lg hover:bg-primary-hover transition-colors",
          open && "hidden",
        )}
      >
        <MessageCircle size={18} />
        <span className="text-sm font-semibold">Ask about our HOA</span>
      </button>

      {open ? (
        <div className="fixed bottom-5 right-5 z-40 w-[min(420px,calc(100vw-2.5rem))] h-[min(640px,calc(100vh-2.5rem))] bg-surface border border-border rounded-xl shadow-lg flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-2">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">HearthHOA assistant</span>
              <span className="text-[11px] text-foreground-subtle inline-flex items-center gap-1">
                <ShieldAlert size={11} /> Answers from your HOA documents only
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              className="p-1 rounded text-foreground-subtle hover:text-foreground hover:bg-surface-hover"
            >
              <X size={18} />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-foreground">Hi neighbor. Ask me anything about our rules and I&apos;ll cite the source.</p>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs uppercase tracking-wide text-foreground-subtle">Common questions</span>
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-left text-sm text-foreground bg-surface-2 hover:bg-surface-hover border border-border rounded-md px-3 py-2"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  m.role === "user"
                    ? "self-end bg-primary text-primary-fg"
                    : "self-start bg-surface-2 text-foreground border border-border",
                )}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.citations && m.citations.length > 0 ? (
                  <div className="mt-2 flex flex-col gap-1">
                    {m.citations.map((c, i) => (
                      <a
                        key={i}
                        href={`/documents/${c.documentId}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink size={12} />
                        {c.documentTitle}
                        {c.section ? ` · ${c.section}` : ""}
                        {c.page ? ` · p.${c.page}` : ""}
                      </a>
                    ))}
                  </div>
                ) : null}
                {m.role === "assistant" ? (
                  <div className="mt-2 flex items-center gap-1">
                    <button
                      onClick={() => rate(m.id, "positive")}
                      aria-label="Helpful"
                      className={cn("p-1 rounded text-foreground-subtle hover:text-foreground", m.feedback === "positive" && "text-success")}
                    >
                      <ThumbsUp size={12} />
                    </button>
                    <button
                      onClick={() => rate(m.id, "negative")}
                      aria-label="Not helpful"
                      className={cn("p-1 rounded text-foreground-subtle hover:text-foreground", m.feedback === "negative" && "text-danger")}
                    >
                      <ThumbsDown size={12} />
                    </button>
                  </div>
                ) : null}
              </div>
            ))}

            {sending ? (
              <div className="self-start inline-flex items-center gap-2 text-xs text-foreground-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle animate-pulse [animation-delay:120ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground-subtle animate-pulse [animation-delay:240ms]" />
              </div>
            ) : null}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 px-3 py-3 border-t border-border bg-surface-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1"
              autoFocus
            />
            <Button type="submit" size="sm" disabled={!input.trim() || sending}>
              <Send size={14} />
            </Button>
          </form>

          <p className="px-3 pb-2 text-[11px] text-foreground-subtle">
            <Badge tone="warning" variant="soft" className="mr-1">AI</Badge>
            Verify important answers with the board.
          </p>
        </div>
      ) : null}
    </>
  );
}
