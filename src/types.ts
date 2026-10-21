import type OpenAI from "openai";

export interface SkillDeveloped {
  skill: string; // one of the approved skills
  how_developed: string;
}

export interface Observation {
  what_to_observe: string;
  how_to_observe: string;
  skill: string;
  /** Graded options for the instructor's feedback drop-down, strongest first. */
  responses: string[];
}

export interface Challenge {
  title: string;
  description: string;
  source: "textbook" | "ai_variation";
  skill: string;
}

/** Lesson plan following the company's Glaser-based four-stage method. */
export interface LessonFlow {
  goal_setting: string;
  readiness_assessment: string[];
  intro: string;
  intensive_study: string[];
  summary_and_next: string;
}

export interface InstructorPrep {
  overview: string;
  theory: string;
  real_world_examples: string[];
  objectives: string[];
  parts_and_preparation: string[];
  lesson_flow: LessonFlow;
  observations: Observation[];
  challenges: Challenge[];
  common_difficulties: string[];
}

export interface Difficulty {
  /** 1 (introductory) – 5 (most demanding) unless the host supplies its own scale. */
  level: string;
  rationale: string;
  source: "curriculum" | "estimated";
}

/** The structured summary returned for a single lesson. */
export interface LessonSummary {
  lesson_title: string;
  lesson_number: string;
  level: string;
  what_was_built: string;
  difficulty: Difficulty;
  skills_developed: SkillDeveloped[];
  curriculum_links: string[];
  /** Warm, non-technical: what the child did and why it matters. */
  parent_summary: string;
  instructor: InstructorPrep;
  fun_fact: string;
}

/**
 * Known facts about a lesson (e.g. from the curriculum-mapping spreadsheet).
 * When supplied, the model uses these instead of estimating.
 */
export interface LessonInfo {
  level?: string;
  difficulty?: string;
  curriculum_links?: string[];
  notes?: string;
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
  /** Override the approved skills list. */
  approvedSkills?: readonly string[];
  /** Known curriculum facts for this lesson. */
  lessonInfo?: LessonInfo;
}
