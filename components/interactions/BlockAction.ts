import { z } from "zod";

export const schema = z.object({
  type: z.literal("block_actions"),
  // TODO: fix any type for ElementAction
  actions: z.array(z.any()),
  team: z
    .object({
      id: z.string(),
      domain: z.string(),
      enterprise_id: z.string().optional(), // undocumented
      enterprise_name: z.string().optional(), // undocumented
    })
    .nullable(),
  user: z.object({
    id: z.string(),
    name: z.string().optional(),
    username: z.string(),
    team_id: z.string().optional(), // undocumented
  }),
  channel: z.object({
    id: z.string(),
    name: z.string(),
  }),
  message: z
    .intersection(
      z.object({
        type: z.literal("message"),
        user: z.string().optional(), // undocumented that this is optional, it won't be there for bot messages
        ts: z.string(),
        text: z.string().optional(), // undocumented that this is optional, but how could it exist on block kit based messages?
      }),
      z.record(z.any()),
    )
    .optional(),
  token: z.string(),
  response_url: z.string(),
  trigger_id: z.string(),

  // TODO: fix any type for ViewOutput
  view: z.any().optional(),
  // TODO: fix any type for ViewStateValue
  state: z
    .object({
      values: z.record(z.record(z.any())),
    })
    .optional(),

  api_app_id: z.string(),

  // TODO: we'll need to fill this out a little more carefully in the future, possibly using a generic parameter
  container: z.record(z.any()),

  // this appears in the block_suggestions schema, but we're not sure when its present or what its type would be
  app_unfurl: z.any().optional(),

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
export type BlockAction = z.infer<typeof schema>;
