import { Sparkles, FileText, Globe, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type AiChatMessageProps = {
  from: "bot" | "user";
  text: string;
  citations?: string[];
  time: string;
  flagged?: boolean;
  unverified?: boolean;
};

export function AiChatMessage({ from, text, citations, time, flagged, unverified }: AiChatMessageProps) {
  return (
    <div className={cn("flex items-start gap-2", from === "user" && "flex-row-reverse")}>
      {from === "bot" ? (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-soft text-primary-soft-fg">
          <Sparkles size={12} />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm flex flex-col gap-1.5",
          from === "user"
            ? "bg-primary text-primary-fg"
            : "bg-surface-2 text-foreground border border-border",
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
        {citations && citations.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {citations.map((c, i) => (
              <a key={i} href="#" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                <FileText size={10} /> {c}
              </a>
            ))}
          </div>
        ) : null}
        <div className="flex items-center gap-2 text-xs text-foreground-subtle pt-0.5">
          <span>{time}</span>
          {unverified ? (
            <span className="inline-flex items-center gap-1">
              <Globe size={10} /> machine-translated, unverified
            </span>
          ) : null}
          {flagged ? (
            <span className="inline-flex items-center gap-1 text-warning">
              <AlertTriangle size={10} /> flagged for review
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
