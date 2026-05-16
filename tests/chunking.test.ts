import { describe, expect, it } from "vitest";
import { chunkText } from "@/lib/chunking";

describe("chunkText", () => {
  it("returns no chunks for empty input", () => {
    expect(chunkText("")).toHaveLength(0);
    expect(chunkText("   \n  ")).toHaveLength(0);
  });

  it("returns a single chunk for short input", () => {
    const out = chunkText("Section 1.1 Pets are allowed within reason.");
    expect(out).toHaveLength(1);
    expect(out[0]?.content).toContain("Pets");
  });

  it("infers a section from a 'Section X' prefix", () => {
    const out = chunkText("Section 4.2 The pool closes at 10 PM.");
    expect(out[0]?.section).toMatch(/^Section/);
  });

  it("creates multiple chunks when input exceeds target chars", () => {
    const para = "Sentence with content. ".repeat(400);
    const out = chunkText(para);
    expect(out.length).toBeGreaterThan(1);
    expect(out[0]?.content.length).toBeLessThanOrEqual(3500);
  });

  it("ascending chunk_index for every chunk", () => {
    const para = "Paragraph one. ".repeat(500);
    const out = chunkText(para);
    out.forEach((c, i) => expect(c.index).toBe(i));
  });
});
