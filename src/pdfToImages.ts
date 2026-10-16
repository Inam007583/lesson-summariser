import { pdf } from "pdf-to-img";
import type { PdfInput } from "./types.js";

/** Renders PDF pages to JPEG data URLs ready for the OpenAI vision API. */
export async function pdfToImages(
  input: PdfInput,
  { scale = 2, maxPages = 10 }: { scale?: number; maxPages?: number } = {},
): Promise<{ images: string[]; totalPages: number }> {
  const source = input instanceof ArrayBuffer ? new Uint8Array(input) : input;
  const doc = await pdf(source, { scale, format: "jpg" });

  try {
    const images: string[] = [];
    const count = Math.min(doc.length, maxPages);
    for (let i = 1; i <= count; i++) {
      const page = await doc.getPage(i);
      images.push(`data:image/jpeg;base64,${page.toString("base64")}`);
    }
    return { images, totalPages: doc.length };
  } finally {
    await doc.destroy();
  }
}
