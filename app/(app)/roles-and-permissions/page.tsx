"use client";

import { Check } from "lucide-react";
import { PageWrapper, Card, CardBody, Badge } from "@/components/ds";
import { ROLE_DEFINITIONS, type Permission, type RoleId } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const PERMISSION_GROUPS: Array<{ label: string; permissions: Permission[] }> = [
  { label: "Announcements", permissions: ["announcements:read", "announcements:write", "announcements:translate", "translations:review"] },
  { label: "Documents", permissions: ["documents:read", "documents:write", "documents:ingest", "documents:pii-review", "documents:export"] },
  { label: "Dues & payments", permissions: ["dues:read:own", "dues:read:all", "dues:write", "dues:export", "payments:write"] },
  { label: "Maintenance", permissions: ["maintenance:read:own", "maintenance:read:all", "maintenance:write:own", "maintenance:write:state"] },
  { label: "Community", permissions: ["board:read", "board:write", "residents:read"] },
  { label: "User management", permissions: ["users:read", "users:write", "users:approve", "roles:read", "roles:write"] },
  { label: "AI & automation", permissions: ["ai:draft", "ai:chat", "imports:run"] },
  { label: "Settings & audit", permissions: ["settings:hoa", "audit:read"] },
];

const ROLE_ORDER: RoleId[] = ["resident", "admin", "super_admin", "treasurer", "secretary", "maintenance_lead"];

export default function RolesAndPermissionsPage() {
  return (
    <PageWrapper
      title="Roles & permissions"
      subtitle="Each role gets a fixed set of permissions. Routes and UI gates read from this matrix."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Roles & permissions" }]}
    >
      <Card>
        <CardBody className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-foreground">Defined roles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLE_ORDER.map((id) => {
              const def = ROLE_DEFINITIONS[id];
              const isActive = id === "resident" || id === "admin";
              return (
                <div key={id} className="flex flex-col gap-1 rounded-md border border-border bg-surface-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground">{def.label}</span>
                    <Badge tone={isActive ? "primary" : "neutral"} variant="soft">{isActive ? "active" : "Phase 2"}</Badge>
                  </div>
                  <p className="text-xs text-foreground-muted">{def.description}</p>
                  <p className="text-xs text-foreground-subtle">{def.permissions.length} permissions</p>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {PERMISSION_GROUPS.map((group) => (
        <Card key={group.label}>
          <CardBody className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">{group.label}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="font-medium text-foreground-muted py-2 pr-4 w-1/3">Permission</th>
                    {ROLE_ORDER.map((id) => (
                      <th key={id} className="font-medium text-foreground-muted py-2 px-2 text-center text-xs uppercase tracking-wide">
                        {ROLE_DEFINITIONS[id].label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.permissions.map((perm) => (
                    <tr key={perm} className="border-t border-border">
                      <td className="py-2 pr-4 font-mono text-xs text-foreground">{perm}</td>
                      {ROLE_ORDER.map((id) => {
                        const has = ROLE_DEFINITIONS[id].permissions.includes(perm);
                        return (
                          <td key={id} className="py-2 px-2 text-center">
                            {has ? (
                              <Check size={14} className={cn("inline-block", "text-success")} />
                            ) : (
                              <span className="text-foreground-subtle">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ))}

      <p className="text-xs text-foreground-subtle">
        Source of truth: <span className="font-mono">lib/permissions.ts</span>. Phase 2 adds custom roles stored in the database; for Phase 1
        the matrix is code-defined so it ships with the application.
      </p>
    </PageWrapper>
  );
}

