import {
  ACTION_IDS,
  BLOCK_ID_PREFIX_DELIMITER,
  BLOCK_IDS,
} from "@/components/interactions/constants";
import { KaomojiModel } from "@/models/kaomoji";
import { Button, Option } from "@slack/types";
import { ResponseMessage } from "@/types/slack";

export const createSearchMessage = (
  query: string,
  kaomojis: KaomojiModel[],
  initialOption?: Option,
): ResponseMessage => {
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
    text: `Here are the search results for "${query}":`,
    blocks: [
      {
        type: "section",
        text: {
          type: "plain_text",
          text: `Here are the search results for "${query}":`,
        },
      },
      {
        type: "actions",
        block_id: `${BLOCK_IDS.KAOMOJI_SEARCH_SELECT}${BLOCK_ID_PREFIX_DELIMITER}${query}`,
        elements: [
          {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select a kaomoji to send...",
            },
            action_id: ACTION_IDS.SELECT_KAOMOJI,
            options: kaomojis.map((kaomoji) => ({
              text: {
                type: "plain_text",
                text: kaomoji.text,
                emoji: false,
              },
              value: kaomoji.text,
            })),
            initial_option: initialOption,
          },
        ],
      },
      {
        type: "actions",
        block_id: `${BLOCK_IDS.KAOMOJI_SEARCH_BUTTONS}${BLOCK_ID_PREFIX_DELIMITER}${query}`,
        elements: buttonElements,
      },
    ],
  };
};
