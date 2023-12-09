import { NextRequest, NextResponse } from "next/server";
import { BlockAction, schema } from "@/components/interactions/BlockAction";
import {
  ACTION_IDS,
  BLOCK_IDS,
  BLOCK_ID_PREFIX_DELIMITER,
} from "@/components/interactions/constants";
import {
  cancelInteractiveMessage,
  respondToInteractiveAction,
} from "@/components/interactions/utils";
import {
  NoUserTokenError,
  deleteUserToken,
  getUserToken,
} from "@/models/oauth/service";
import { config } from "@/config";
import kaomojiCommands from "@/components/commands";
import { ResponseMessage } from "@/types/slack";
import { sendFollowUpSearchMessage } from "@/components/interactions/search";
import { sendFollowUpListMessage } from "@/components/interactions/list";
import {
  removeShortcut,
  saveShortcut,
  sendFollowUpShortcutsMessage,
} from "@/components/interactions/shortcut";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const formJson = JSON.parse(formData.get("payload")?.toString() ?? "{}");

  const blockAction = schema.parse(formJson);

  try {
    const token = await getUserToken(blockAction.user.id);
  } catch (err: any) {
    if (err instanceof NoUserTokenError) {
      await respondToInteractiveAction(blockAction, {
        text: kaomojiCommands.getNoUserTokenText(config.SERVER_URL),
      });
      return NextResponse.json({ text: "No user token found" });
    }
  }

  console.log("interaction", blockAction);

  const action: any = blockAction.actions[0];
  let response: ResponseMessage = { text: "Invalid Action" };
  switch (action.action_id) {
    case ACTION_IDS.SELECT_KAOMOJI:
      switch (action.block_id.split(BLOCK_ID_PREFIX_DELIMITER)[0]) {
        case BLOCK_IDS.KAOMOJI_LIST_SELECT:
          response = await sendFollowUpListMessage(blockAction);
          break;
        case BLOCK_IDS.KAOMOJI_SEARCH_SELECT:
          response = await sendFollowUpSearchMessage(blockAction);
          break;
        case BLOCK_IDS.KAOMOJI_SHORTCUTS_SELECT:
        default:
          response = await sendFollowUpShortcutsMessage(blockAction);
          break;
      }
      break;
    case ACTION_IDS.REMOVE_SHORTCUT:
      response = await removeShortcut(blockAction);
      break;
    case ACTION_IDS.CANCEL:
      response = await cancelInteractiveMessage(blockAction);
      break;
    case ACTION_IDS.SEND_KAOMOJI:
      response = await _sendKaomojiAsUser(blockAction);
      break;
    case ACTION_IDS.SAVE_SHORTCUT:
      response = await saveShortcut(blockAction);
      break;
  }
  return NextResponse.json(response);
}

const _sendKaomojiAsUser = async (blockAction: BlockAction) => {
  const text = blockAction.actions[0].value;
  try {
    const token = await getUserToken(blockAction.user.id);
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      body: JSON.stringify({
        channel: blockAction.channel.id,
        text,
        blocks: [
          {
            type: "section",
            text: {
              type: "plain_text",
              text,
              emoji: false,
            },
          },
        ],
        as_user: true,
      }),
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    const body = await response.json();
    console.log("chat.postMessage response", body);
    if (!body.ok) {
      await deleteUserToken(token.id);
      await respondToInteractiveAction(blockAction, {
        text: kaomojiCommands.getNoUserTokenText(config.SERVER_URL),
      });
      return { text: "No user token found" };
    } else {
      await cancelInteractiveMessage(blockAction);
    }
  } catch (err: any) {
    if (err instanceof NoUserTokenError) {
      await respondToInteractiveAction(blockAction, {
        text: kaomojiCommands.getNoUserTokenText(config.SERVER_URL),
      });
      return { text: "No user token found" };
    }
    console.error(err);
    await respondToInteractiveAction(blockAction, err);
    return { text: "Error while responding to interactive action" };
  }

  return { text: "Sending kaomoji as user" };
};
