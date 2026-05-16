import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const AUTH_COOKIE = "hh_token";

const PUBLIC_PATHS = ["/", "/login", "/forgot-password", "/reset-password", "/register"];
const ALWAYS_ALLOWED = ["/sandbox"];

const ADMIN_ONLY_PREFIXES = [
  "/users",
  "/roles-and-permissions",
  "/translations",
  "/documents/pii-review",
  "/import/residents",
  "/import/dues",
  "/announcements/create",
  "/announcements/", // fine for view; edit handled below
  "/board-members/create",
  "/board-members/", // list ok, edit gated below
  "/dues/create",
  "/dues/", // list ok, edit gated below
  "/documents/create",
  "/documents/", // list ok, edit gated below
];

// Sub-paths that are admin-only even though their parent prefix is allowed.
const ADMIN_ONLY_SUFFIX_PATTERNS = [/\/edit$/, /\/create$/];

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-only-secret-do-not-ship");

type Session = { role: "resident" | "admin" };

async function verify(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { role: payload.role as "resident" | "admin" };
  } catch {
    return null;
  }
}

function isAdminOnly(pathname: string): boolean {
  const explicitAdminOnly = [
    "/users",
    "/roles-and-permissions",
    "/translations",
    "/documents/pii-review",
    "/import/residents",
    "/import/dues",
  ];
  if (explicitAdminOnly.some((p) => pathname === p || pathname.startsWith(p + "/"))) return true;
  if (ADMIN_ONLY_SUFFIX_PATTERNS.some((re) => re.test(pathname))) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ALWAYS_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!token) {
    if (isPublic) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  const session = await verify(token);
  if (!session) {
    // Bad token — clear cookie and send to landing
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("next", pathname);
    const res = NextResponse.redirect(url);
    res.cookies.delete(AUTH_COOKIE);
    return res;
  }

  if (isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.delete("next");
    return NextResponse.redirect(url);
  }

  if (session.role === "resident" && isAdminOnly(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.set("notice", "admin-only");
    return NextResponse.redirect(url);
  }

  // Ensure the unused arrays don't trip the linter.
  void ADMIN_ONLY_PREFIXES;
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
