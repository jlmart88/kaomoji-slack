import { parse } from "@conform-to/zod";
import { NextRequest, NextResponse } from "next/server";
import kaomojiCommands from "@/components/commands";
import { sendSearchMessage } from "@/components/interactions/search";
import { sendShortcutsMessage } from "@/components/interactions/shortcut";
import { sendListMessage } from "@/components/interactions/list";
import { Command, schema } from "@/components/interactions/Command";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const submission = parse(formData, { schema });

  if (submission.intent !== "submit" || !submission.value) {
    return NextResponse.json(
      { error: "Error parsing request input" },
      { status: 400 },
    );
  }

  const command = submission.value;
  let response;
  if (kaomojiCommands.isCommandQuery(command.text ?? "")) {
    response = await _performCommand(command);
  } else {
    response = await sendSearchMessage(command);
  }
  return NextResponse.json(response);
}

async function _performCommand(command: Command) {
  const query = command.text ?? "";
  console.log("performing command", query);
  let response = {};

  switch (query) {
    case kaomojiCommands.COMMAND_LIST.EMPTY:
    case kaomojiCommands.COMMAND_LIST.SHORTCUTS:
      return await sendShortcutsMessage(command);
    case kaomojiCommands.COMMAND_LIST.LIST:
      return await sendListMessage();
    case kaomojiCommands.COMMAND_LIST.HELP:
      response = _composeEphemeralMessage(kaomojiCommands.getHelpText());
      break;
    default:
      response = _composeEphemeralMessage(
        kaomojiCommands.getDefaultText(query),
      );
      break;
  }
  console.log("command response", response);
  return response;
}

function _composeEphemeralMessage(message: string) {
  return {
    text: message,
    response_type: "ephemeral",
  };
}
