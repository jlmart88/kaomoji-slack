import {
  ACTION_IDS,
  BLOCK_ID_PREFIX_DELIMITER,
  BLOCK_IDS,
  LEGACY_INTERACTION_LIST
} from 'kaomoji/components/interactions/constants';
import { SearchCallbackModel } from 'kaomoji/models/interactionCallback/searchCallback';
import { KaomojiModel } from 'kaomoji/models/kaomoji';
import { Button, Option } from 'kaomoji/node_modules/@slack/types';
import { ResponseMessage } from 'kaomoji/types/slack';


export const createSearchMessage = (query: string, kaomojis: KaomojiModel[], initialOption?: Option): ResponseMessage => {
  const buttonElements: Button[] = [
    {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Cancel',
      },
      action_id: ACTION_IDS.CANCEL,
    },
  ];

  if (initialOption) {
    buttonElements.unshift({
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Send',
      },
      value: initialOption.value,
      action_id: ACTION_IDS.SEND_KAOMOJI,
      style: 'primary',
    } as any,
    {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Save to Shortcuts',
      },
      value: initialOption.value,
      action_id: ACTION_IDS.SAVE_SHORTCUT,
    });
  }

  return {
    response_type: 'ephemeral',
    replace_original: !!initialOption,
    text: `Here are the search results for "${query}":`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `Here are the search results for "${query}":`,
        }
      },
      {
        type: 'actions',
        block_id: `${BLOCK_IDS.KAOMOJI_SEARCH_SELECT}${BLOCK_ID_PREFIX_DELIMITER}${query}`,
        elements: [{
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select a kaomoji to send...',
          },
          action_id: ACTION_IDS.SELECT_KAOMOJI,
          options: kaomojis.map(kaomoji => ({
            text: {
              type: 'plain_text',
              text: kaomoji.text,
              emoji: false,
            },
            value: kaomoji.text
          })),
          initial_option: initialOption,
        }],
      },
      {
        type: 'actions',
        block_id: `${BLOCK_IDS.KAOMOJI_SEARCH_BUTTONS}${BLOCK_ID_PREFIX_DELIMITER}${query}`,
        elements: buttonElements,
      },
    ],
  };
}

export function createLegacySearchMessage(searchCallbackInstance: SearchCallbackModel, kaomojiText: string) {
  const callback_id = searchCallbackInstance.callback_id;
  const interactiveMessage = {
    response_type: 'ephemeral',
    attachments: [
      {
        text: kaomojiText,
        callback_id: callback_id,
        attachment_type: 'default',
        actions: [
          {
            name: LEGACY_INTERACTION_LIST.SEND,
            text: 'Send',
            type: 'button',
            style: 'primary',
            value: kaomojiText
          },
          {
            name: LEGACY_INTERACTION_LIST.NEXT_SEARCH,
            text: 'Next',
            type: 'button',
            value: 'next'
          },
          {
            name: LEGACY_INTERACTION_LIST.SAVE_SHORTCUT,
            text: 'Save to Shortcuts',
            type: 'button',
            value: kaomojiText
          },
          {
            name: LEGACY_INTERACTION_LIST.CANCEL,
            text: 'Cancel',
            type: 'button',
            value: 'cancel'
          },
        ]
      }
    ]
  };

  return interactiveMessage;
}