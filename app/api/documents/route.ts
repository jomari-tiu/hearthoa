import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { route, parseBody, paginationFromUrl, searchFromUrl, listMeta } from "@/lib/handler";
import { requireSession, requireAdmin } from "@/lib/session";

const CATEGORIES = ["bylaws", "ccrs", "minutes", "financials", "forms", "other"] as const;

const createSchema = z.object({
  title: z.string().min(1).max(180),
  category: z.enum(CATEGORIES),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  fileSizeBytes: z.number().int().nonnegative(),
  isChatbotIndexed: z.boolean().default(false),
});

type CreateInput = z.infer<typeof createSchema>;

export const GET = route(async (req: NextRequest) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const { page, pageSize, skip, take } = paginationFromUrl(url);
  const search = searchFromUrl(url);
  const categoryParam = url.searchParams.get("category");

  const where = {
    hoaId: session.hoaId,
    ...(search ? { title: { contains: search, mode: "insensitive" as const } } : {}),
    ...(categoryParam && (CATEGORIES as readonly string[]).includes(categoryParam)
      ? { category: categoryParam as (typeof CATEGORIES)[number] }
      : {}),
    parentDocumentId: null,
  };

  const [rows, totalCount] = await Promise.all([
    prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { uploadedBy: { select: { id: true, name: true } } },
    }),
    prisma.document.count({ where }),
  ]);

  return NextResponse.json({
    data: rows.map(serialize),
    meta: listMeta({ page, pageSize, totalCount }),
  });
});

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const input = await parseBody<CreateInput>(req, createSchema);

  const row = await prisma.document.create({
    data: {
      hoaId: session.hoaId,
      uploadedById: session.userId,
      title: input.title,
      category: input.category,
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      fileSizeBytes: BigInt(input.fileSizeBytes),
      isChatbotIndexed: input.isChatbotIndexed,
      piiReviewStatus: input.isChatbotIndexed ? "pending" : "excluded",
    },
    include: { uploadedBy: { select: { id: true, name: true } } },
  });

  return NextResponse.json(serialize(row));
});

type DocumentRow = {
  id: string; hoaId: string; uploadedById: string;
  uploadedBy: { id: string; name: string } | null;
  title: string;
  category: (typeof CATEGORIES)[number];
  fileUrl: string; fileType: string; fileSizeBytes: bigint;
  version: number; isChatbotIndexed: boolean;
  piiReviewStatus: "pending" | "acknowledged_safe" | "flagged" | "excluded";
  piiReviewedAt: Date | null;
  parentDocumentId: string | null;
  createdAt: Date;
};

function serialize(row: DocumentRow) {
  return {
    id: row.id,
    hoaId: row.hoaId,
    uploadedById: row.uploadedById,
    uploadedBy: row.uploadedBy,
    title: row.title,
    category: row.category,
    fileUrl: row.fileUrl,
    fileType: row.fileType,
    fileSizeBytes: Number(row.fileSizeBytes),
    version: row.version,
    isChatbotIndexed: row.isChatbotIndexed,
    piiReviewStatus: row.piiReviewStatus,
    piiReviewedAt: row.piiReviewedAt?.toISOString() ?? null,
    parentDocumentId: row.parentDocumentId,
    createdAt: row.createdAt.toISOString(),
  };
}
