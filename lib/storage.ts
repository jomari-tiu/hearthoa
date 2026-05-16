// File storage abstraction. Defaults to local-disk in ./uploads for dev; designed so
// switching to S3/R2 means swapping this module without touching the route handlers.

import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const STORAGE_DIR = path.resolve(process.cwd(), "uploads");

async function ensureDir() {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
}

export async function storeFile(
  buffer: Buffer,
  opts: { hoaId: string; originalName: string },
): Promise<{ url: string; key: string }> {
  await ensureDir();
  const ext = path.extname(opts.originalName) || "";
  const key = `${opts.hoaId}/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const full = path.join(STORAGE_DIR, key);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, buffer);
  return { url: `/api/files/${encodeURIComponent(key)}`, key };
}

export async function readFile(key: string): Promise<Buffer> {
  const full = path.join(STORAGE_DIR, key);
  return fs.readFile(full);
}

export async function readFileFromUrl(url: string): Promise<Buffer> {
  if (url.startsWith("/api/files/")) {
    const key = decodeURIComponent(url.slice("/api/files/".length));
    return readFile(key);
  }
  // External URL — fetch directly. Used in tests / when migrating to real S3.
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
