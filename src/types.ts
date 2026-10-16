import type OpenAI from "openai";

/** The structured summary returned for a single lesson. */
export interface LessonSummary {
  lesson_title: string;
  lesson_number: string;
  what_was_built: string;
  /** Warm, non-technical: "what your child learned today". */
  parent_summary: string;
  /** Technical, for instructor lesson prep. */
  instructor_summary: string;
  learning_aims: string[];
  skills_practised: string[];
  fun_fact: string;
}

/** Anything that holds PDF bytes, or a path to a PDF on disk. */
export type PdfInput = string | Buffer | Uint8Array | ArrayBuffer;

export interface SummariseOptions {
  /** OpenAI API key. Defaults to process.env.OPENAI_API_KEY. */
  apiKey?: string;
  /** Pre-configured OpenAI client (takes precedence over apiKey). */
  client?: OpenAI;
  /** Vision model. Defaults to process.env.OPENAI_MODEL, then "gpt-4o". */
  model?: string;
  /** Only the first N pages are sent. Default 10. */
  maxPages?: number;
  /** Render scale; 2 ≈ 150 dpi, enough to read part numbers. Default 2. */
  scale?: number;
  /** OpenAI image detail level. Default "high" (needed for small diagram text). */
  detail?: "low" | "high" | "auto";
}
