import { describe, expect, it, beforeAll } from "vitest";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-test-secret-test-secret";
});

describe("session JWT round-trip", () => {
  it("signs and verifies a session", async () => {
    const { signSession, verifySession } = await import("@/lib/session");
    const token = await signSession({
      userId: "u1",
      hoaId: "h1",
      role: "admin",
      email: "a@b.test",
      name: "Test",
    });
    const decoded = await verifySession(token);
    expect(decoded?.userId).toBe("u1");
    expect(decoded?.role).toBe("admin");
  });

  it("rejects invalid tokens", async () => {
    const { verifySession } = await import("@/lib/session");
    expect(await verifySession("not-a-token")).toBeNull();
  });
});
