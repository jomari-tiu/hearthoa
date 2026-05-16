import { describe, expect, it } from "vitest";
import { scanPii } from "@/lib/pii-scan";

describe("scanPii", () => {
  it("returns no matches for clean text", () => {
    const result = scanPii("This is the bylaw about lawn maintenance frequency.");
    expect(result.flagged).toBe(false);
    expect(result.matches).toHaveLength(0);
  });

  it("detects emails", () => {
    const result = scanPii("Contact treasurer@sunset-ridge.test for questions.");
    expect(result.flagged).toBe(true);
    expect(result.matches.some((m) => m.type === "email")).toBe(true);
  });

  it("detects US phone numbers in several formats", () => {
    const variants = ["(415) 555-1234", "415.555.1234", "+1 415-555-1234"];
    for (const v of variants) {
      const result = scanPii(`Call ${v} for support.`);
      expect(result.matches.some((m) => m.type === "phone"), `phone in: ${v}`).toBe(true);
    }
  });

  it("detects SSN-like patterns", () => {
    const result = scanPii("SSN on file: 123-45-6789.");
    expect(result.matches.some((m) => m.type === "ssn")).toBe(true);
  });

  it("detects street addresses", () => {
    const result = scanPii("Owner of record at 1024 Sunset Ridge Drive.");
    expect(result.matches.some((m) => m.type === "address")).toBe(true);
  });

  it("reports byte offsets", () => {
    const text = "Email: a@b.test end.";
    const result = scanPii(text);
    const m = result.matches.find((x) => x.type === "email");
    expect(m).toBeTruthy();
    expect(m && text.slice(m.start, m.end)).toBe("a@b.test");
  });
});
