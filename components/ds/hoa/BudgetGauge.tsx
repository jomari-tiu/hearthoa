import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatMoney } from "@/lib/format";

export type BudgetGaugeProps = {
  spentCents: number;
  capCents: number;
  label?: string;
};

export function BudgetGauge({ spentCents, capCents, label = "AI monthly spend" }: BudgetGaugeProps) {
  const pct = capCents > 0 ? Math.min(100, (spentCents / capCents) * 100) : 0;
  const tone: "primary" | "warning" | "danger" = pct > 90 ? "danger" : pct > 70 ? "warning" : "primary";
  const message = pct > 90 ? "Approaching monthly cap" : pct > 70 ? "On track — watch closely" : "Well within budget";

  return (
    <Card>
      <CardContent className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-wide text-foreground-subtle">{label}</span>
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatMoney(spentCents)}
            <span className="text-foreground-subtle font-normal"> / {formatMoney(capCents)} cap</span>
          </span>
        </div>
        <Progress value={pct} tone={tone} className="h-2" />
        <p className="text-xs text-foreground-muted">{message}</p>
      </CardContent>
    </Card>
  );
}
