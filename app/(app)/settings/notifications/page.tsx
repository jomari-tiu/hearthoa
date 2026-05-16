"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PageWrapper, Card, CardBody, Button, Badge, toast, Skeleton } from "@/components/ds";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Preference = { type: string; emailEnabled: boolean };

const TYPE_LABELS: Record<string, { label: string; description: string; locked?: boolean }> = {
  new_announcement: { label: "New announcements", description: "General announcements from the board." },
  request_status_change: { label: "Maintenance updates", description: "Status changes on your maintenance requests. Always on.", locked: true },
  dues_reminder: { label: "Dues reminders", description: "Reminders before a due date." },
  account_approval: { label: "Account approval", description: "When admins approve or reject your account.", locked: true },
  weekly_digest: { label: "Weekly digest", description: "A summary email each Monday." },
};

const CRITICAL_LABEL =
  "Critical announcements (emergencies, legal notices, dues-due) bypass these settings and always email everyone.";

export default function NotificationsSettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const res = await api.get<{ data: Preference[] }>("/notification-preferences");
      return res.data.data;
    },
  });

  const [prefs, setPrefs] = useState<Preference[]>([]);
  useEffect(() => {
    if (data) setPrefs(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (preferences: Preference[]) => api.patch("/notification-preferences", { preferences }),
  });

  async function handleSave() {
    try {
      await save.mutateAsync(prefs);
      toast.success("Preferences saved");
    } catch {
      toast.error("Couldn't save preferences");
    }
  }

  function toggle(type: string, value: boolean) {
    setPrefs((prev) => prev.map((p) => (p.type === type ? { ...p, emailEnabled: value } : p)));
  }

  return (
    <PageWrapper
      title="Email preferences"
      subtitle="Choose which non-essential emails reach your inbox."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }, { label: "Notifications" }]}
    >
      <Card>
        <CardBody className="flex flex-col divide-y divide-border">
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            prefs.map((p) => {
              const meta = TYPE_LABELS[p.type] ?? { label: p.type, description: "" };
              const id = `pref-${p.type}`;
              return (
                <div key={p.type} className="flex items-start justify-between gap-4 py-3">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Label htmlFor={id} className="cursor-pointer">{meta.label}</Label>
                      {meta.locked ? <Badge tone="danger" variant="soft">Always sent</Badge> : null}
                    </div>
                    <span className="text-xs text-foreground-muted">{meta.description}</span>
                  </div>
                  <Switch
                    id={id}
                    checked={p.emailEnabled}
                    disabled={meta.locked}
                    onCheckedChange={(v) => toggle(p.type, v)}
                  />
                </div>
              );
            })
          )}
        </CardBody>
      </Card>

      <p className="text-xs text-foreground-subtle">{CRITICAL_LABEL}</p>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={save.isPending}>Save preferences</Button>
      </div>
    </PageWrapper>
  );
}
