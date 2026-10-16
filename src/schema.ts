// JSON Schema for OpenAI Structured Outputs — guarantees the response shape.
// Keep in sync with LessonSummary in types.ts.

const str = { type: "string" } as const;
const strList = { type: "array", items: str } as const;

export const LESSON_SUMMARY_SCHEMA = {
  name: "lesson_summary",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      lesson_title: str,
      lesson_number: str,
      what_was_built: str,
      parent_summary: str,
      instructor_summary: str,
      learning_aims: strList,
      skills_practised: strList,
      fun_fact: str,
    },
    required: [
      "lesson_title",
      "lesson_number",
      "what_was_built",
      "parent_summary",
      "instructor_summary",
      "learning_aims",
      "skills_practised",
      "fun_fact",
    ],
  },
};
