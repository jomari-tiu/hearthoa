import { Megaphone, AlertTriangle, Globe, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/format";

export type AnnouncementCardProps = {
  priority: "general" | "critical";
  title: string;
  body: string;
  author: { name: string; role?: string };
  time: string;
  audience?: string;
  translations?: string;
  optOut?: boolean;
};

export function AnnouncementCard({ priority, title, body, author, time, audience, translations, optOut }: AnnouncementCardProps) {
  const Icon = priority === "critical" ? AlertTriangle : Megaphone;
  return (
    <Card className={priority === "critical" ? "border-danger/50" : undefined}>
      <CardContent className="flex flex-col gap-3">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={priority === "critical" ? "danger" : "neutral"} variant="solid">
              <Icon size={11} /> {priority === "critical" ? "Critical" : "General"}
            </Badge>
            {audience ? <span className="text-xs text-foreground-subtle">{audience}</span> : null}
          </div>
          <span className="text-xs text-foreground-subtle">{time}</span>
        </header>
        <div className="flex flex-col gap-1">
          <h4 className="text-base font-semibold text-foreground">{title}</h4>
          <p className="text-sm text-foreground-muted">{body}</p>
        </div>
        <footer className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-border">
          <div className="flex items-center gap-2 pt-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px]">{initials(author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-foreground">{author.name}</span>
              {author.role ? <span className="text-xs text-foreground-subtle">{author.role}</span> : null}
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-foreground-subtle pt-2">
            {translations ? (
              <span className="inline-flex items-center gap-1">
                <Globe size={11} /> {translations} · machine-translated, unverified
              </span>
            ) : null}
            {priority === "critical" ? (
              <span className="inline-flex items-center gap-1 text-danger">
                <Bell size={11} /> bypasses opt-out
              </span>
            ) : optOut ? (
              <span>opt-out respected</span>
            ) : null}
          </div>
        </footer>
      </CardContent>
    </Card>
  );
}
