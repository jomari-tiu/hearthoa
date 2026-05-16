import { describe, expect, it, beforeAll } from "vitest";

describe("embeddings stub", () => {
  beforeAll(() => {
    delete process.env.OPENAI_API_KEY;
  });

  it("returns 1536-dim zero vectors when no API key", async () => {
    const { embed } = await import("@/lib/embeddings");
    const { model, vectors } = await embed(["alpha", "beta"]);
    expect(model).toContain("stub");
    expect(vectors).toHaveLength(2);
    expect(vectors[0]).toHaveLength(1536);
    expect(vectors[0]?.every((n) => n === 0)).toBe(true);
  });
});
