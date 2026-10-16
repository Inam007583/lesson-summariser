# lesson-summariser

Turns a RoboThink lesson PDF into a structured summary using an OpenAI vision model.
It only takes a file in and returns JSON. There's no delivery, database or auth.

Lesson sheets are mostly images, so pages are rendered to JPEGs and sent to the model as images (no text extraction).

## Usage

```ts
import { summariseLesson } from "lesson-summariser";

const summary = await summariseLesson(pdfBuffer); // Buffer | Uint8Array | ArrayBuffer | file path
```

Returns:

```json
{
  "lesson_title": "",
  "lesson_number": "",
  "what_was_built": "",
  "parent_summary": "",
  "instructor_summary": "",
  "learning_aims": [],
  "skills_practised": [],
  "fun_fact": ""
}
```

The shape is enforced by OpenAI Structured Outputs (`src/schema.ts`).

## Config

| Env var          | Default  |                                      |
| ---------------- | -------- | ------------------------------------ |
| `OPENAI_API_KEY` | required | or pass `apiKey` / `client` in options |
| `OPENAI_MODEL`   | `gpt-4o` | `gpt-4o-mini` is cheaper but reads small diagram text less well |

Options (second argument): `apiKey`, `client` (an existing `OpenAI` instance), `model`, `maxPages` (10), `scale` (2), `detail` (`"high"`).

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
npm run try -- path/to/lesson.pdf
```

The prompt lives in `src/prompt.ts`. Edit it to tune summary quality.

### Test page

```sh
npm run demo   # → http://localhost:3100
```

This opens a drag-and-drop page that shows the parent and instructor summaries side by side, with the raw JSON underneath.
It's only for local testing and isn't part of the component (`demo/` doesn't need to be copied into the host app).
