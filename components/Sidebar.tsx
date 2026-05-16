"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  Receipt,
  FolderOpen,
  Wrench,
  Users,
  UsersRound,
  IdCard,
  Settings,
  Languages,
  ShieldCheck,
  Shield,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/app/_components/Logo";
import { Button } from "@/components/ds";
import { Badge } from "@/components/ui/badge";
import { logoutRequest } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Role = "resident" | "admin";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  roles: Role[];
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["resident", "admin"] },
  { href: "/announcements", label: "Announcements", icon: Megaphone, roles: ["resident", "admin"] },
  { href: "/translations", label: "Translations", icon: Languages, roles: ["admin"] },
  { href: "/dues", label: "Dues", icon: Receipt, roles: ["resident", "admin"] },
  { href: "/documents", label: "Documents", icon: FolderOpen, roles: ["resident", "admin"] },
  { href: "/documents/pii-review", label: "PII review", icon: ShieldCheck, roles: ["admin"] },
  { href: "/maintenance-requests", label: "Maintenance", icon: Wrench, roles: ["resident", "admin"] },
  { href: "/board-members", label: "Board", icon: Users, roles: ["resident", "admin"] },
  { href: "/residents", label: "Residents", icon: IdCard, roles: ["resident", "admin"] },
  { href: "/users", label: "Users", icon: UsersRound, roles: ["admin"] },
  { href: "/roles-and-permissions", label: "Roles & permissions", icon: Shield, roles: ["admin"] },
  { href: "/settings/notifications", label: "Notifications", icon: Settings, roles: ["resident", "admin"] },
];

type SidebarProps = { role: Role; userName?: string };

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = NAV.filter((i) => i.roles.includes(role));

  async function handleSignOut() {
    await logoutRequest();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between gap-3 px-4 h-12 border-b border-border bg-surface">
        <Logo />
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-foreground hover:bg-surface-hover"
        >
          <Menu size={18} />
        </button>
      </header>

      {mobileOpen ? (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-[oklch(15%_0.012_var(--hue)/0.5)]" onClick={() => setMobileOpen(false)} aria-hidden />
          <aside className="relative w-72 max-w-[85vw] h-full bg-surface flex flex-col border-r border-border shadow-lg">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md text-foreground hover:bg-surface-hover"
              >
                <X size={18} />
              </button>
            </div>
            <NavList items={items} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <UserFooter role={role} userName={userName} onSignOut={handleSignOut} />
          </aside>
        </div>
      ) : null}

      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-surface">
        <div className="px-5 py-5 border-b border-border">
          <Logo />
        </div>
        <NavList items={items} pathname={pathname} />
        <UserFooter role={role} userName={userName} onSignOut={handleSignOut} />
      </aside>
    </>
  );
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 px-3 h-9 rounded-md text-sm font-medium transition-colors",
              active
                ? "bg-primary-soft text-primary-soft-fg"
                : "text-foreground-muted hover:bg-surface-hover hover:text-foreground",
            )}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserFooter({ role, userName, onSignOut }: { role: Role; userName?: string; onSignOut: () => void }) {
  return (
    <div className="flex flex-col gap-2 px-3 py-3 border-t border-border">
      {userName ? (
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="text-foreground-muted truncate">{userName}</span>
          <Badge tone={role === "admin" ? "primary" : "neutral"} variant="soft">
            {role}
          </Badge>
        </div>
      ) : null}
      <Button variant="ghost" className="w-full justify-start" onClick={onSignOut} leftIcon={<LogOut size={16} />}>
        Sign out
      </Button>
    </div>
  );
}
