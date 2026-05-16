import { describe, expect, it } from "vitest";
import { formatMoney, truncate, initials } from "@/lib/format";

describe("formatMoney", () => {
  it("renders cents as USD", () => {
    expect(formatMoney(12345)).toBe("$123.45");
  });
  it("handles zero", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });
});

describe("truncate", () => {
  it("leaves short strings alone", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });
  it("ellipsises long strings", () => {
    expect(truncate("aaaaaaaaaa", 5)).toBe("aaaa…");
  });
});

describe("initials", () => {
  it("takes first letters of first two words", () => {
    expect(initials("Maya Chen")).toBe("MC");
    expect(initials("Jordan")).toBe("J");
    expect(initials("jane Marie Doe")).toBe("JM");
  });
});
