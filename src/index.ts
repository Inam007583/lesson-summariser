import OpenAI from "openai";
import { pdfToImages } from "./pdfToImages.js";
import { SYSTEM_PROMPT, USER_PROMPT } from "./prompt.js";
import { LESSON_SUMMARY_SCHEMA } from "./schema.js";
import type { LessonSummary, PdfInput, SummariseOptions } from "./types.js";

export type { LessonSummary, PdfInput, SummariseOptions } from "./types.js";

/**
 * Summarises a RoboThink lesson PDF.
 * Renders each page to an image, sends them to an OpenAI vision model
 * and returns the structured summary. No delivery, storage or auth.
 */
export async function summariseLesson(
  file: PdfInput,
  options: SummariseOptions = {},
): Promise<LessonSummary> {
  const {
    model = process.env.OPENAI_MODEL || "gpt-4o",
    maxPages = 10,
    scale = 2,
    detail = "high",
  } = options;

  const client = options.client ?? new OpenAI({ apiKey: options.apiKey ?? process.env.OPENAI_API_KEY });

  const { images } = await pdfToImages(file, { scale, maxPages });
  if (images.length === 0) throw new Error("PDF has no pages");

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.4,
    response_format: { type: "json_schema", json_schema: LESSON_SUMMARY_SCHEMA },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: USER_PROMPT },
          ...images.map((url) => ({ type: "image_url" as const, image_url: { url, detail } })),
        ],
      },
    ],
  });

  const message = completion.choices[0]?.message;
  if (message?.refusal) throw new Error(`Model refused: ${message.refusal}`);
  if (!message?.content) throw new Error("Empty response from model");

  return JSON.parse(message.content) as LessonSummary;
}
