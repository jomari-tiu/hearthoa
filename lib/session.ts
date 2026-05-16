import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { AUTH_COOKIE } from "@/middleware";
import { ApiError, type SessionPayload } from "./session-types";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-only-secret-do-not-ship");
const TOKEN_TTL = "7d";

export { ApiError, type SessionPayload } from "./session-types";

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new ApiError(401, "Sign in to continue.");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "admin") {
    throw new ApiError(403, "Admin access required.");
  }
  return session;
}
