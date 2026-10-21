import { summariseLesson } from "./summarise.js";
import type { LessonInfo, LessonSummary, PdfInput, SummariseOptions } from "./types.js";

export interface BulkItem {
  /** Label used in results, e.g. the file name. */
  name: string;
  file: PdfInput;
  lessonInfo?: LessonInfo;
}

export type BulkResult =
  | { name: string; ok: true; summary: LessonSummary }
  | { name: string; ok: false; error: string };

/**
 * Summarises many lessons, a few at a time. One failure doesn't stop the rest;
 * results come back in the same order as the input.
 */
export async function summariseLessons(
  items: BulkItem[],
  { concurrency = 3, ...options }: SummariseOptions & { concurrency?: number } = {},
): Promise<BulkResult[]> {
  const results: BulkResult[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      const { name, file, lessonInfo } = items[i];
      try {
        const summary = await summariseLesson(file, { ...options, lessonInfo: lessonInfo ?? options.lessonInfo });
        results[i] = { name, ok: true, summary };
      } catch (err) {
        results[i] = { name, ok: false, error: err instanceof Error ? err.message : String(err) };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}
