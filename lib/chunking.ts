// Naive whitespace-aware chunker. ~800 tokens per chunk with 100-token overlap.
// 1 token ≈ 4 chars for English text — close enough for non-billing chunking.

const TARGET_CHARS = 3200; // ~800 tokens
const OVERLAP_CHARS = 400; // ~100 tokens

export type Chunk = {
  index: number;
  content: string;
  pageNumber: number | null;
  section: string | null;
};

export function chunkText(text: string): Chunk[] {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!normalized) return [];

  const chunks: Chunk[] = [];
  let cursor = 0;
  let idx = 0;

  while (cursor < normalized.length) {
    const end = Math.min(normalized.length, cursor + TARGET_CHARS);
    let cut = end;
    if (end < normalized.length) {
      // try to end at a paragraph boundary
      const para = normalized.lastIndexOf("\n\n", end);
      if (para > cursor + TARGET_CHARS / 2) {
        cut = para;
      } else {
        const sent = normalized.lastIndexOf(". ", end);
        if (sent > cursor + TARGET_CHARS / 2) cut = sent + 1;
      }
    }
    const content = normalized.slice(cursor, cut).trim();
    if (content) {
      chunks.push({
        index: idx,
        content,
        pageNumber: null,
        section: inferSection(content),
      });
      idx += 1;
    }
    if (cut >= normalized.length) break;
    cursor = Math.max(cut - OVERLAP_CHARS, cursor + 1);
  }

  return chunks;
}

const SECTION_PREFIX = /^(Section\s+\d+(\.\d+)?|Article\s+\d+|Bylaw\s+\d+)/i;

function inferSection(content: string): string | null {
  const firstLine = content.split("\n").find((l) => l.trim().length > 0) ?? "";
  const m = SECTION_PREFIX.exec(firstLine.trim());
  return m ? m[0] : null;
}
