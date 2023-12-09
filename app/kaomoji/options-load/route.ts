import { NextRequest, NextResponse } from "next/server";
import { schema } from "@/components/interactions/BlockSuggestion";
import { ACTION_IDS } from "@/components/interactions/constants";
import { sendListOptions } from "../../../components/interactions/list";
import { Option } from "@slack/types";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const formJson = JSON.parse(formData.get("payload")?.toString() ?? "{}");

  const blockSuggestion = schema.parse(formJson);
  let response: { options: Option[] } = { options: [] };
  switch (blockSuggestion.action_id) {
    case ACTION_IDS.SELECT_KAOMOJI:
      response = await sendListOptions(blockSuggestion);
      break;
  }
  return NextResponse.json(response);
}
