// DRAFT approved long-term skills — awaiting manager sign-off.
// The model can ONLY choose from this list (enforced by the JSON schema),
// so every lesson reports skills in the same language.
// Tools and tasks (DC motors, wiring, gear alignment) are deliberately NOT skills.

export const APPROVED_SKILLS = [
  "Problem Solving",
  "Logical Thinking",
  "Critical Thinking",
  "Creative Thinking",
  "Spatial Awareness",
  "Attention to Detail",
  "Project Management",
  "Fine Motor Skills",
  "Perseverance",
  "Teamwork and Communication",
  "Engineering Design",
  "Entrepreneurship",
] as const;

export type ApprovedSkill = (typeof APPROVED_SKILLS)[number];
