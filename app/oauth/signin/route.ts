import { NextResponse } from "next/server";
import { config } from "@/config";

export function GET() {
  return NextResponse.redirect(
    `https://slack.com/oauth/v2/authorize?client_id=${config.SLACK_CLIENT_ID}&scope=commands&user_scope=chat:write`
  );
}
