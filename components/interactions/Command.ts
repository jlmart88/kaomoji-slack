import { z } from "zod";

// Derived from:
// https://github.com/slackapi/bolt-js/blob/5df8393187803c9fbe8d4256a7a79808d66b3415/src/types/command/index.ts#L21
export const schema = z.object({
  token: z.string(),
  command: z.string(),
  text: z.string().optional().or(z.literal("")),
  response_url: z.string(),
  trigger_id: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  team_id: z.string(),
  team_domain: z.string(),
  channel_id: z.string(),
  channel_name: z.string(),
  api_app_id: z.string(),
  enterprise_id: z.string().optional(),
  enterprise_name: z.string().optional(),
  is_enterprise_install: z.string().optional(),
});
export type Command = z.infer<typeof schema>;
