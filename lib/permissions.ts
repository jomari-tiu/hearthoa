// Permissions system.
//
// `users.role` is a Prisma enum (currently `resident` + `admin`). Permissions are
// derived strings — every API route asks "does this session have permission X?".
// New role types are added by extending ROLE_PERMISSIONS without touching routes.
//
// For Phase 1.5 we model treasurer / secretary / maintenance_lead / super_admin in
// the permission map even though they aren't yet seeded as enum values. As soon as
// the Prisma enum is expanded, the existing routes start honoring them.

import { ApiError, type SessionPayload } from "./session-types";

export const PERMISSIONS = [
  "announcements:read",
  "announcements:write",
  "announcements:translate",
  "documents:read",
  "documents:write",
  "documents:ingest",
  "documents:pii-review",
  "documents:export",
  "dues:read:own",
  "dues:read:all",
  "dues:write",
  "dues:export",
  "payments:write",
  "maintenance:read:own",
  "maintenance:read:all",
  "maintenance:write:own",
  "maintenance:write:state",
  "board:read",
  "board:write",
  "residents:read",
  "users:read",
  "users:write",
  "users:approve",
  "roles:read",
  "roles:write",
  "translations:review",
  "ai:draft",
  "ai:chat",
  "imports:run",
  "settings:hoa",
  "audit:read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

// All known role identifiers. Roles flagged with `system: true` are seeded from the
// Prisma enum. Custom roles (Phase 2) would also live here once stored in the DB.
export type RoleId =
  | "resident"
  | "admin"
  | "super_admin"
  | "treasurer"
  | "secretary"
  | "maintenance_lead";

const RESIDENT_PERMS: Permission[] = [
  "announcements:read",
  "documents:read",
  "dues:read:own",
  "maintenance:read:own",
  "maintenance:write:own",
  "board:read",
  "residents:read",
  "ai:chat",
];

const ADMIN_PERMS: Permission[] = [...PERMISSIONS];

const TREASURER_PERMS: Permission[] = [
  ...RESIDENT_PERMS,
  "dues:read:all",
  "dues:write",
  "dues:export",
  "payments:write",
  "imports:run",
  "audit:read",
];

const SECRETARY_PERMS: Permission[] = [
  ...RESIDENT_PERMS,
  "announcements:write",
  "announcements:translate",
  "documents:write",
  "documents:export",
  "translations:review",
  "ai:draft",
];

const MAINTENANCE_LEAD_PERMS: Permission[] = [
  ...RESIDENT_PERMS,
  "maintenance:read:all",
  "maintenance:write:state",
];

export const ROLE_DEFINITIONS: Record<
  RoleId,
  { label: string; description: string; permissions: Permission[]; system: boolean }
> = {
  resident: {
    label: "Resident",
    description: "Homeowners and verified residents. Read-mostly access; can submit their own maintenance requests and use the chatbot.",
    permissions: RESIDENT_PERMS,
    system: true,
  },
  admin: {
    label: "Admin",
    description: "Full board access. Manages every module and every other user.",
    permissions: ADMIN_PERMS,
    system: true,
  },
  super_admin: {
    label: "Super admin",
    description: "Reserved for the HOA owner or platform operator. Only role that can manage custom roles in Phase 2.",
    permissions: ADMIN_PERMS,
    system: true,
  },
  treasurer: {
    label: "Treasurer",
    description: "Manages dues, payments, financial exports, and the audit log. Cannot post announcements or upload documents.",
    permissions: TREASURER_PERMS,
    system: true,
  },
  secretary: {
    label: "Secretary",
    description: "Posts announcements, uploads documents, runs translations. No financial access.",
    permissions: SECRETARY_PERMS,
    system: true,
  },
  maintenance_lead: {
    label: "Maintenance lead",
    description: "Triages and resolves maintenance requests for the whole community. No financial or announcement access.",
    permissions: MAINTENANCE_LEAD_PERMS,
    system: true,
  },
};

// Maps the live Prisma enum values into RoleId. Until the enum is extended, the
// only mapped values are `resident` and `admin`. Adding to the Prisma enum is a
// one-line schema change + migration; nothing else has to move.
type RuntimeRole = SessionPayload["role"];

function asRoleId(role: RuntimeRole): RoleId {
  if (role === "admin") return "admin";
  return "resident";
}

export function hasPermission(session: SessionPayload | null, permission: Permission): boolean {
  if (!session) return false;
  const def = ROLE_DEFINITIONS[asRoleId(session.role)];
  return def.permissions.includes(permission);
}

export function requirePermission(session: SessionPayload | null, permission: Permission): SessionPayload {
  if (!session) throw new ApiError(401, "Sign in to continue.");
  if (!hasPermission(session, permission)) {
    throw new ApiError(403, "You don't have permission to do that.");
  }
  return session;
}

export function permissionsFor(role: RuntimeRole): Permission[] {
  return ROLE_DEFINITIONS[asRoleId(role)].permissions;
}
