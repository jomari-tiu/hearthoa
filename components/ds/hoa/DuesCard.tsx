import { Calendar, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMoney } from "@/lib/format";

export type DuesCardProps = {
  unit: string;
  owner: string;
  amountCents: number;
  due: string;
  period: string;
  status: "paid" | "pending" | "overdue" | "upcoming";
  autopay?: boolean;
  paidPct?: number;
};

const STATUS_TONE: Record<DuesCardProps["status"], "success" | "warning" | "danger" | "neutral"> = {
  paid: "success",
  pending: "warning",
  overdue: "danger",
  upcoming: "neutral",
};

export function DuesCard({ unit, owner, amountCents, due, period, status, autopay, paidPct }: DuesCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-foreground-subtle">Unit {unit}</div>
            <div className="text-sm text-foreground-muted">{owner}</div>
          </div>
          <Badge tone={STATUS_TONE[status]} variant="soft">{status}</Badge>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tabular-nums text-foreground">{formatMoney(amountCents)}</span>
          <span className="text-xs text-foreground-subtle">/ {period}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-foreground-muted">
          <span className="inline-flex items-center gap-1"><Calendar size={11} /> Due {due}</span>
          {autopay ? <span className="inline-flex items-center gap-1 text-success"><Check size={11} /> Autopay on</span> : null}
        </div>
        {typeof paidPct === "number" ? (
          <div className="flex flex-col gap-1.5">
            <Progress value={paidPct} tone={status === "overdue" ? "danger" : "primary"} />
            <span className="text-xs text-foreground-subtle">{paidPct}% of annual collected</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
