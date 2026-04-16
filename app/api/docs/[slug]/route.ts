import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const ALLOWED: Record<string, string> = {
  tipe:        "tipe.pdf",
  reducteur:   "reducteur.pdf",
  figurines:   "figurines.pdf",
  fabrication: "fabrication.pdf",
  mebc:        "mebc.pdf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filename = ALLOWED[slug];
  if (!filename) return new NextResponse("Not found", { status: 404 });

  const filePath = join(process.cwd(), "private", "docs", filename);
  let buffer: Buffer;
  try {
    buffer = readFileSync(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(buffer.buffer as ArrayBuffer, {
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control":       "no-store",
      "X-Robots-Tag":        "noindex",
    },
  });
}
