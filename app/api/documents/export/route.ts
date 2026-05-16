import { NextResponse } from "next/server";
import JSZip from "jszip";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { route } from "@/lib/handler";
import { requireAdmin } from "@/lib/session";
import { readFileFromUrl } from "@/lib/storage";

export const GET = route(async () => {
  const session = await requireAdmin();

  const docs = await prisma.document.findMany({
    where: { hoaId: session.hoaId, parentDocumentId: null },
    orderBy: { createdAt: "asc" },
    include: { uploadedBy: { select: { name: true } } },
  });

  const zip = new JSZip();
  const manifest: Record<string, string | number | null>[] = [];

  for (const doc of docs) {
    const safeTitle = doc.title.replace(/[^A-Za-z0-9 ._-]+/g, "_");
    const ext = inferExt(doc.fileType) || "bin";
    const path = `${doc.category}/${safeTitle}.${ext}`;
    try {
      const buf = await readFileFromUrl(doc.fileUrl);
      zip.file(path, buf as unknown as Buffer);
      manifest.push({
        title: doc.title,
        category: doc.category,
        version: doc.version,
        fileType: doc.fileType,
        fileSizeBytes: Number(doc.fileSizeBytes),
        uploadedBy: doc.uploadedBy?.name ?? "",
        uploadedAt: doc.createdAt.toISOString(),
        path,
      });
    } catch (error) {
      manifest.push({
        title: doc.title,
        category: doc.category,
        version: doc.version,
        fileType: doc.fileType,
        fileSizeBytes: Number(doc.fileSizeBytes),
        uploadedBy: doc.uploadedBy?.name ?? "",
        uploadedAt: doc.createdAt.toISOString(),
        path: "",
        error: error instanceof Error ? error.message : "missing",
      });
    }
  }

  zip.file("manifest.csv", Papa.unparse(manifest));

  const blob = await zip.generateAsync({ type: "nodebuffer" });
  return new NextResponse(blob as unknown as BodyInit, {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="hearthhoa-documents-${new Date().toISOString().slice(0, 10)}.zip"`,
    },
  });
});

function inferExt(mime: string): string | null {
  const m = mime.toLowerCase();
  if (m.includes("pdf")) return "pdf";
  if (m.includes("wordprocessingml.document") || m.endsWith("/docx")) return "docx";
  if (m.includes("png")) return "png";
  if (m.includes("jpeg") || m.includes("jpg")) return "jpg";
  if (m.startsWith("text/plain")) return "txt";
  return null;
}
