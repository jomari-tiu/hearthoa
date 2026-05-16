import { NextResponse, type NextRequest } from "next/server";
import { storeFile } from "@/lib/storage";
import { ApiError, requireAdmin } from "@/lib/session";
import { route } from "@/lib/handler";

const MAX_BYTES = 25 * 1024 * 1024;

export const POST = route(async (req: NextRequest) => {
  const session = await requireAdmin();
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new ApiError(400, "Attach a file under the 'file' field.");
  }
  if (file.size > MAX_BYTES) {
    throw new ApiError(413, "Files must be 25 MB or smaller.");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await storeFile(buffer, { hoaId: session.hoaId, originalName: file.name });
  return NextResponse.json({
    url: stored.url,
    key: stored.key,
    fileType: file.type || "application/octet-stream",
    fileSizeBytes: file.size,
    originalName: file.name,
  });
});
