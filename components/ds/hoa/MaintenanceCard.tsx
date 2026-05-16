import { Home, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { initials } from "@/lib/format";

export type MaintenanceCardProps = {
  id: string | number;
  title: string;
  unit: string;
  reporter: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  opened: string;
  assignee?: string;
  photos?: number;
};

const STATUS_TONE: Record<MaintenanceCardProps["status"], "info" | "warning" | "success" | "neutral"> = {
  open: "info",
  "in-progress": "warning",
  resolved: "success",
  closed: "neutral",
};

const PRIORITY_TONE: Record<MaintenanceCardProps["priority"], "neutral" | "info" | "warning" | "danger"> = {
  low: "neutral",
  normal: "info",
  high: "warning",
  urgent: "danger",
};

export function MaintenanceCard({ id, title, unit, reporter, status, priority, opened, assignee, photos = 0 }: MaintenanceCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 flex-wrap">
        <div className="font-mono text-sm text-foreground-subtle">#{id}</div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <Badge tone={PRIORITY_TONE[priority]} variant="soft">{priority}</Badge>
          </div>
          <div className="text-xs text-foreground-subtle flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1"><Home size={11} /> Unit {unit}</span>
            <span>·</span>
            <span>Reported by {reporter}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock size={11} /> {opened}</span>
            {photos > 0 ? (
              <>
                <span>·</span>
                <span>{photos} photos</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge tone={STATUS_TONE[status]} variant="solid">{status.replace("-", " ")}</Badge>
          {assignee ? (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[9px]">{initials(assignee)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-foreground-muted">{assignee}</span>
            </div>
          ) : (
            <span className="text-xs italic text-foreground-subtle">Unassigned</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
