import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodTypeAny } from "zod";
import { ApiError } from "./session";

type RouteContext<P> = { params: Promise<P> };

type Handler<P> = (req: NextRequest, ctx: RouteContext<P>) => Promise<NextResponse> | NextResponse;

export function route<P = Record<string, never>>(handler: Handler<P>) {
  return async (req: NextRequest, ctx: RouteContext<P>) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }
  if (error instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".") || "_";
      errors[key] = errors[key] ?? [];
      errors[key].push(issue.message);
    }
    return NextResponse.json({ message: "Invalid input.", errors }, { status: 422 });
  }
  console.error(error);
  return NextResponse.json({ message: "Server error." }, { status: 500 });
}

export async function parseBody<T>(req: NextRequest, schema: ZodTypeAny): Promise<T> {
  const body = await req.json().catch(() => ({}));
  return schema.parse(body) as T;
}

export function listMeta(opts: { page: number; pageSize: number; totalCount: number }) {
  return {
    page: opts.page,
    pageSize: opts.pageSize,
    totalCount: opts.totalCount,
    hasNext: opts.page * opts.pageSize < opts.totalCount,
  };
}

export function paginationFromUrl(url: URL) {
  const page = Math.max(1, Number(url.searchParams.get("pageNumber") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? 10)));
  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

export function searchFromUrl(url: URL): string | undefined {
  const q = url.searchParams.get("search");
  return q && q.trim() ? q.trim() : undefined;
}
