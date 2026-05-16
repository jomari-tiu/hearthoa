// Document text extractors. PDF and DOCX get proper parsers; plain text/markdown
// are returned as-is. Scanned PDFs without embedded text remain a TODO (needs OCR).
//
// pdf-parse is CJS-only — dynamic import to keep the Next bundler happy.

export async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
  const type = (mimeType || "").toLowerCase();
  if (type === "application/pdf" || type.endsWith("/pdf")) {
    const mod = (await import("pdf-parse")) as unknown as
      | { default: (b: Buffer) => Promise<{ text: string }> }
      | ((b: Buffer) => Promise<{ text: string }>);
    const parse = typeof mod === "function" ? mod : mod.default;
    const parsed = await parse(buffer);
    return parsed.text ?? "";
  }
  if (
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    type.endsWith("/docx")
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.default.extractRawText({ buffer });
    return result.value ?? "";
  }
  if (type.startsWith("text/")) {
    return buffer.toString("utf-8");
  }
  return buffer.toString("utf-8");
}
