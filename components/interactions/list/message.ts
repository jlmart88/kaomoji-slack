import { ACTION_IDS, BLOCK_IDS } from "@/components/interactions/constants";
import { Button, Option } from "@slack/types";
import { KaomojiModel } from "@/models/kaomoji";
import { ResponseMessage } from "@/types/slack";
import _ from "lodash";

export const createOptionsList = (
  kaomojis: KaomojiModel[],
): { options: Option[] } => {
  return {
    options: _.map(kaomojis, (kaomoji) => ({
      text: {
        type: "plain_text",
        text: kaomoji.text,
        emoji: false,
      },
      value: kaomoji.text,
    })),
  };
};

export const createListMessage = (initialOption?: Option): ResponseMessage => {
  const buttonElements: Button[] = [
    {
      type: "button",
      text: {
        type: "plain_text",
        text: "Cancel",
      },
      action_id: ACTION_IDS.CANCEL,
    },
  ];

  if (initialOption) {
    buttonElements.unshift(
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Send",
        },
        value: initialOption.value,
        action_id: ACTION_IDS.SEND_KAOMOJI,
        style: "primary",
      } as any,
      {
        type: "button",
        text: {
          type: "plain_text",
          text: "Save to Shortcuts",
        },
        value: initialOption.value,
        action_id: ACTION_IDS.SAVE_SHORTCUT,
      },
    );
  }

  return {
    response_type: "ephemeral",
    replace_original: true,
    text: `Search all kaomoji:`,
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `Search all kaomoji:`,
        },
      },
      {
        type: "actions",
        block_id: `${BLOCK_IDS.KAOMOJI_LIST_SELECT}`,
        elements: [
          {
            type: "external_select",
            placeholder: {
              type: "plain_text",
              text: "Search for a kaomoji to send...",
            },
            action_id: ACTION_IDS.SELECT_KAOMOJI,
            min_query_length: 3,
            initial_option: initialOption,
          },
        ],
      },
      {
        type: "actions",
        block_id: `${BLOCK_IDS.KAOMOJI_LIST_BUTTONS}`,
        elements: buttonElements,
      },
    ],
  };
};
