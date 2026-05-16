import { FileText, Lock, Shield, AlertTriangle, Download, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type DocumentItemProps = {
  name: string;
  type: string;
  size: string;
  updated: string;
  piiStatus: "cleared" | "pending" | "blocked";
  tags?: string[];
  encrypted?: boolean;
};

const PII_BADGE: Record<DocumentItemProps["piiStatus"], { tone: "success" | "warning" | "danger"; label: string; Icon: typeof Shield }> = {
  cleared: { tone: "success", label: "PII cleared", Icon: Shield },
  pending: { tone: "warning", label: "PII review pending", Icon: AlertTriangle },
  blocked: { tone: "danger", label: "PII review required", Icon: AlertTriangle },
};

export function DocumentItem({ name, type, size, updated, piiStatus, tags, encrypted = true }: DocumentItemProps) {
  const pii = PII_BADGE[piiStatus];
  const Icon = pii.Icon;
  return (
    <Card>
      <CardContent className="flex items-center gap-4 flex-wrap">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-surface-2 text-foreground-muted">
          <FileText size={18} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold text-foreground truncate">{name}</span>
            {encrypted ? <Lock size={11} className="text-foreground-subtle" /> : null}
          </div>
          <div className="text-xs text-foreground-subtle flex items-center gap-1.5 flex-wrap">
            <span className="uppercase font-mono">{type}</span>
            <span>·</span>
            <span>{size}</span>
            <span>·</span>
            <span>Updated {updated}</span>
          </div>
          {tags && tags.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap pt-1">
              {tags.map((t) => (
                <Badge key={t} tone="neutral" variant="outline">{t}</Badge>
              ))}
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tone={pii.tone} variant="soft">
            <Icon size={11} /> {pii.label}
          </Badge>
          <Button variant="ghost" size="icon" aria-label="Download"><Download size={16} /></Button>
          <Button variant="ghost" size="icon" aria-label="More"><MoreHorizontal size={16} /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
