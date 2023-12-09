import { z } from "zod";

export const schema = z.object({
  type: z.literal("block_suggestion"),
  block_id: z.string(),
  action_id: z.string(),
  value: z.string(),

  api_app_id: z.string(),
  team: z
    .object({
      id: z.string(),
      domain: z.string(),
      enterprise_id: z.string().optional(),
      enterprise_name: z.string().optional(),
    })
    .nullable(),
  channel: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    team_id: z.string().optional(),
  }),
  token: z.string(), // legacy verification token
  container: z.record(z.any()),
  // exists for blocks in either a modal or a home tab
  // TODO: fix any type for ViewOutput
  view: z.any().optional(),
  // exists for enterprise installs
  is_enterprise_install: z.boolean().optional(),
  enterprise: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional()
    .nullable(),
});
export type BlockSuggestion = z.infer<typeof schema>;
