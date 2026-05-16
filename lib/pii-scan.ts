// Lightweight PII scanner. Regex only — covers the obvious cases (email, phone, SSN,
// street address numbers). Returns the matched substrings with byte offsets so the
// admin can see exactly what was flagged before clearing the doc to acknowledged_safe.

type Match = {
  type: "email" | "phone" | "ssn" | "address";
  value: string;
  start: number;
  end: number;
};

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]?\d{3}[-.\s]?\d{4}/g;
const SSN = /\b\d{3}-\d{2}-\d{4}\b/g;
const ADDRESS = /\b\d{1,5}\s+[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*){0,4}\s+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Court|Ct|Way|Place|Pl)\b/g;

export function scanPii(text: string): { matches: Match[]; flagged: boolean } {
  const matches: Match[] = [];
  pushMatches(matches, text, EMAIL, "email");
  pushMatches(matches, text, PHONE, "phone");
  pushMatches(matches, text, SSN, "ssn");
  pushMatches(matches, text, ADDRESS, "address");
  return { matches, flagged: matches.length > 0 };
}

function pushMatches(out: Match[], text: string, pattern: RegExp, type: Match["type"]) {
  const re = new RegExp(pattern.source, pattern.flags);
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push({ type, value: m[0], start: m.index, end: m.index + m[0].length });
  }
}
