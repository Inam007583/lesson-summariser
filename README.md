# lesson-summariser

Turns a RoboThink lesson PDF into instructor prep and parent-facing outcomes using an OpenAI vision model.
It only takes a file in and returns JSON. There's no delivery, database or auth.

Lesson sheets are mostly images, so pages are rendered to JPEGs and sent to the model as images (no text extraction).
The prompt follows the company teaching methodology (Glaser's four stages, Gagne, PSI/IGE, ARCS), and skills come only from an approved list.

## Usage

```ts
import { summariseLesson, summariseLessons } from "lesson-summariser";

// One lesson (Buffer | Uint8Array | ArrayBuffer | file path)
const summary = await summariseLesson(pdfBuffer);

// Many lessons, 3 at a time; one failure doesn't stop the rest
const results = await summariseLessons([
  { name: "F1 Racer.pdf", file: buf1 },
  { name: "Extendoclaw.pdf", file: buf2 },
]);
// → [{ name, ok: true, summary } | { name, ok: false, error }, ...] in input order
```

## Output

See [`examples/f1-racer.json`](examples/f1-racer.json) for a full real example. The shape is defined in `src/types.ts` and enforced by OpenAI Structured Outputs (`src/schema.ts`).

| Field | Audience | What it holds |
| --- | --- | --- |
| `lesson_title`, `lesson_number`, `level`, `what_was_built` | both | as printed on the sheet |
| `parent_summary` | parents | what the child did and **why it matters**: skills, difficulty, curriculum |
| `skills_developed[]` | both | approved skill + how the lesson develops it |
| `difficulty` | both | `level`, `rationale`, `source` (`curriculum` or `estimated`) |
| `curriculum_links[]` | parents | only from supplied curriculum data, never invented |
| `instructor.overview`, `theory`, `real_world_examples`, `objectives`, `parts_and_preparation` | instructors | five-minute prep |
| `instructor.lesson_flow` | instructors | goal setting → readiness questions → intro → intensive study → summary/next |
| `instructor.observations[]` | instructors | what/how to observe, linked skill, `responses[]` for the feedback drop-down |
| `instructor.challenges[]` | instructors | textbook challenges + AI variations, each linked to a skill |
| `instructor.common_difficulties[]` | instructors | sticking points and how to help |
| `fun_fact` | both | |

## Approved skills

`src/skills.ts` holds the approved long-term skills (**draft, awaiting sign-off**). The schema only allows these values, so the model can't invent new ones.
Override with `approvedSkills: [...]` in options.

## Curriculum data

Difficulty and national-curriculum mapping already exist in the curriculum spreadsheet. Pass them per lesson and the model uses them instead of estimating:

```ts
await summariseLesson(pdf, {
  lessonInfo: { level: "Junior Engineer", difficulty: "3", curriculum_links: ["KS2 Science: Forces"] },
});
```

Without `lessonInfo`, difficulty is estimated (1–5, marked `"estimated"`) and `curriculum_links` is empty.

## Config

| Env var          | Default  |                                      |
| ---------------- | -------- | ------------------------------------ |
| `OPENAI_API_KEY` | required | or pass `apiKey` / `client` in options |
| `OPENAI_MODEL`   | `gpt-4o` | any vision-capable model the key's project allows (e.g. `gpt-4o-mini`, `gpt-5.4-mini`) |

Options: `apiKey`, `client`, `model`, `maxPages` (10), `scale` (2), `detail` (`"high"`), `approvedSkills`, `lessonInfo`; plus `concurrency` (3) for `summariseLessons`.

## Example: Next.js route handler

```ts
export const runtime = "nodejs"; // native canvas, not edge

export async function POST(req: Request) {
  const file = (await req.formData()).get("file") as File;
  return Response.json(await summariseLesson(await file.arrayBuffer()));
}
```

## Local testing

```sh
npm install
cp .env.example .env   # add your key
npm run try -- path/to/lesson.pdf   # prints JSON
npm run demo                        # → http://localhost:3100
```

The test page takes up to 10 PDFs at once and shows parent and instructor tabs for each lesson, with JSON and CSV download.
It's only for local testing and isn't part of the component (`demo/` doesn't need to be copied into the host app).

The prompt lives in `src/prompt.ts`. Edit it to tune output quality. Put internal source documents in `materials/`, which git ignores.
