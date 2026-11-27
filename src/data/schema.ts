import { z } from "zod";

export const relationKinds = [
  "birth",
  "marriage",
  "divine",
  "social",
  "adoption",
  "guardian",
  "variant",
  "teacher",
  "ally",
  "rival",
] as const;
export const characterSchema = z.object({
  id: z.string().min(1),
  universe: z.string(),
  name: z.string().min(1),
  aliases: z.array(z.string()),
  title: z.string(),
  chapter: z.number().int().nonnegative(),
  generation: z.number().int().positive(),
  gender: z.enum(["Female", "Male", "Collective"]),
  dynasty: z.string(),
  branch: z.string(),
  kingdom: z.string().optional(),
  portrait: z.string(),
  biography: z.string().min(1),
  major: z.boolean(),
  war: z.boolean(),
  sources: z.array(z.string()).min(1),
  events: z.array(z.string()),
  skills: z.array(z.string()),
  register: z.boolean(),
});
export const relationshipSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  kind: z.enum(relationKinds),
  reference: z.string(),
  tradition: z.string(),
  note: z.string(),
});
export type Character = z.infer<typeof characterSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Kind = Relationship["kind"];
export const labels: Record<Kind, string> = {
  birth: "Birth parentage",
  marriage: "Marriage",
  divine: "Divine parentage",
  social: "Dynastic parentage",
  adoption: "Adoption",
  guardian: "Guardianship",
  variant: "Alternate account",
  teacher: "Teacher",
  ally: "Ally",
  rival: "Rival",
};
