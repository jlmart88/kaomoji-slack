import { createShortcutsMessage } from "@/components/interactions/shortcut/message";
import { respondToInteractiveAction } from "@/components/interactions/utils";
import { Button } from "@slack/types";
import Debug from "debug";
import { ResponseMessage } from "@/types/slack";

import {
  createShortcut,
  getShortcutsForUser,
  hasUserExceededShortcutLimit,
  deleteShortcut,
  MAX_SHORTCUTS_PER_USER,
} from "@/models/shortcut/service";
import kaomojiCommands from "@/components/commands";
import { Command } from "../Command";
import { BlockAction } from "../BlockAction";

const debug = Debug("interactions:search");

export const saveShortcut = async (blockAction: BlockAction) => {
  let message: ResponseMessage;
  const kaomoji = blockAction.actions[0].value;
  if (!kaomoji) {
    message = {
      text: "An unknown error occurred while creating your kaomoji shortcut.",
      response_type: "ephemeral",
      replace_original: false,
    };
    respondToInteractiveAction(blockAction, message);
    return { text: message.text };
  }

  const hasExceeded = await hasUserExceededShortcutLimit(blockAction.user.id);
  if (hasExceeded) {
    message = {
      text:
        "You have reached the shortcut limit of " +
        MAX_SHORTCUTS_PER_USER +
        ", remove one to add " +
        kaomoji +
        " as a shortcut." +
        "\n" +
        kaomojiCommands.getShortcutsUsageText(),
      response_type: "ephemeral",
      replace_original: false,
    };
    respondToInteractiveAction(blockAction, message);
    return { text: message.text };
  }

  try {
    await createShortcut(blockAction.user.id, kaomoji);
    message = {
      text:
        "A kaomoji shortcut for " +
        kaomoji +
        " has been created." +
        "\n" +
        kaomojiCommands.getShortcutsUsageText(),
      response_type: "ephemeral",
      replace_original: false,
    };
  } catch (err: any) {
    if (err?.code === 11000) {
      message = {
        text:
          "A kaomoji shortcut for " +
          kaomoji +
          " already exists." +
          "\n" +
          kaomojiCommands.getShortcutsUsageText(),
        response_type: "ephemeral",
        replace_original: false,
      };
    } else {
      message = {
        text: "An unknown error occurred while creating your kaomoji shortcut.",
        response_type: "ephemeral",
        replace_original: false,
      };
    }
  }
  respondToInteractiveAction(blockAction, message);
  return { text: message.text };
};

export const sendShortcutsMessage = async (
  command: Command,
): Promise<ResponseMessage | void> => {
  let slackResponse: ResponseMessage;
  const user = command.user_id;
  try {
    const shortcuts = await getShortcutsForUser(user);
    slackResponse = createShortcutsMessage(shortcuts);
  } catch (err: any) {
    debug(err);
    slackResponse = {
      text: err?.message,
      response_type: "ephemeral",
    };
  }
  return slackResponse;
};

export const sendFollowUpShortcutsMessage = async (
  blockAction: BlockAction,
  shouldResetSelection?: boolean,
) => {
  let slackResponse: ResponseMessage;
  try {
    const shortcuts = await getShortcutsForUser(blockAction.user.id);
    // this is a follow up interaction, so parse out the selection and send an updated message
    let selectedOption;
    if (!shouldResetSelection) {
      const { actions } = blockAction;
      const action = actions[0];
      selectedOption = action.selected_option;
    }
    slackResponse = createShortcutsMessage(shortcuts, selectedOption);
  } catch (err: any) {
    debug(err);
    slackResponse = {
      text: err?.message,
      response_type: "ephemeral",
    };
  }
  await respondToInteractiveAction(blockAction, slackResponse);
  return { text: "OK" };
};

export const removeShortcut = async (blockAction: BlockAction) => {
  const { actions } = blockAction;
  const action: Button = actions[0];
  let slackResponse: ResponseMessage;
  try {
    await deleteShortcut(action.value);
    await sendFollowUpShortcutsMessage(blockAction, true);
  } catch (err: any) {
    debug(err);
    slackResponse = {
      text: err?.message,
      response_type: "ephemeral",
    };
    await respondToInteractiveAction(blockAction, slackResponse);
  }
  return { text: "OK" };
};
