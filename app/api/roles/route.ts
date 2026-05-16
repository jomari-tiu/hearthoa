import { NextResponse } from "next/server";
import { route } from "@/lib/handler";
import { requireSession } from "@/lib/session";
import { ROLE_DEFINITIONS, type RoleId } from "@/lib/permissions";

// Read-only roles endpoint. Phase 2 will add POST/PATCH for custom roles.
export const GET = route(async () => {
  await requireSession();
  const data = (Object.keys(ROLE_DEFINITIONS) as RoleId[]).map((id) => ({
    id,
    label: ROLE_DEFINITIONS[id].label,
    description: ROLE_DEFINITIONS[id].description,
    system: ROLE_DEFINITIONS[id].system,
    permissions: ROLE_DEFINITIONS[id].permissions,
  }));
  return NextResponse.json({ data });
});
