// JSON Schema for OpenAI Structured Outputs — guarantees the response shape.
// Keep in sync with LessonSummary in types.ts.

const str = { type: "string" } as const;
const strList = { type: "array", items: str } as const;

function obj(properties: Record<string, unknown>) {
  return { type: "object", additionalProperties: false, properties, required: Object.keys(properties) };
}

export function lessonSummarySchema(approvedSkills: readonly string[]) {
  const skill = { type: "string", enum: [...approvedSkills] };

  return {
    name: "lesson_summary",
    strict: true,
    schema: obj({
      lesson_title: str,
      lesson_number: str,
      level: str,
      what_was_built: str,
      difficulty: obj({
        level: str,
        rationale: str,
        source: { type: "string", enum: ["curriculum", "estimated"] },
      }),
      skills_developed: { type: "array", items: obj({ skill, how_developed: str }) },
      curriculum_links: strList,
      parent_summary: str,
      instructor: obj({
        overview: str,
        theory: str,
        real_world_examples: strList,
        objectives: strList,
        parts_and_preparation: strList,
        lesson_flow: obj({
          goal_setting: str,
          readiness_assessment: strList,
          intro: str,
          intensive_study: strList,
          summary_and_next: str,
        }),
        observations: {
          type: "array",
          items: obj({ what_to_observe: str, how_to_observe: str, skill, responses: strList }),
        },
        challenges: {
          type: "array",
          items: obj({
            title: str,
            description: str,
            source: { type: "string", enum: ["textbook", "ai_variation"] },
            skill,
          }),
        },
        common_difficulties: strList,
      }),
      fun_fact: str,
    }),
  };
}
