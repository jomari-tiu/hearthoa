"use client";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export type NotificationPrefRowProps = {
  label: string;
  description?: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  critical?: boolean;
  onChange?: (channel: "email" | "sms" | "push", value: boolean) => void;
};

export function NotificationPrefRow({ label, description, email, sms, push, critical, onChange }: NotificationPrefRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-t border-border first:border-t-0">
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          {critical ? <Badge tone="danger" variant="soft">Critical — always sent</Badge> : null}
        </div>
        {description ? <p className="text-xs text-foreground-muted">{description}</p> : null}
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <Channel label="Email" checked={email} disabled={critical} onChange={(v) => onChange?.("email", v)} />
        <Channel label="SMS" checked={sms} disabled={critical} onChange={(v) => onChange?.("sms", v)} />
        <Channel label="Push" checked={push} disabled={critical} onChange={(v) => onChange?.("push", v)} />
      </div>
    </div>
  );
}

function Channel({ label, checked, disabled, onChange }: { label: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex flex-col items-center gap-1 text-xs text-foreground-subtle">
      <span>{label}</span>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </label>
  );
}
