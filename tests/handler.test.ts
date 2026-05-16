import { describe, expect, it } from "vitest";
import { listMeta, paginationFromUrl, searchFromUrl } from "@/lib/handler";

describe("listMeta", () => {
  it("reports hasNext when more rows exist past this page", () => {
    expect(listMeta({ page: 1, pageSize: 10, totalCount: 25 })).toEqual({
      page: 1,
      pageSize: 10,
      totalCount: 25,
      hasNext: true,
    });
  });

  it("reports hasNext=false on the last page", () => {
    expect(listMeta({ page: 3, pageSize: 10, totalCount: 25 }).hasNext).toBe(false);
  });
});

describe("paginationFromUrl", () => {
  it("uses defaults when params absent", () => {
    const url = new URL("http://localhost/api/anything");
    expect(paginationFromUrl(url)).toEqual({ page: 1, pageSize: 10, skip: 0, take: 10 });
  });

  it("clamps pageSize to [1,100]", () => {
    const big = new URL("http://localhost/?pageSize=500");
    expect(paginationFromUrl(big).pageSize).toBe(100);
    const zero = new URL("http://localhost/?pageSize=0");
    expect(paginationFromUrl(zero).pageSize).toBe(1);
  });

  it("computes skip", () => {
    const url = new URL("http://localhost/?pageNumber=3&pageSize=20");
    expect(paginationFromUrl(url).skip).toBe(40);
  });
});

describe("searchFromUrl", () => {
  it("trims and returns the search param", () => {
    const url = new URL("http://localhost/?search=  hello  ");
    expect(searchFromUrl(url)).toBe("hello");
  });

  it("returns undefined for empty strings", () => {
    expect(searchFromUrl(new URL("http://localhost/?search="))).toBeUndefined();
    expect(searchFromUrl(new URL("http://localhost/?search=   "))).toBeUndefined();
    expect(searchFromUrl(new URL("http://localhost/"))).toBeUndefined();
  });
});
