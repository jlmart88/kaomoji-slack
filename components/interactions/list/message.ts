import { ACTION_IDS, BLOCK_IDS, LEGACY_INTERACTION_LIST } from 'kaomoji/components/interactions/constants';
import { ListCallbackModel } from 'kaomoji/models/interactionCallback/listCallback';
import { Button, MessageAttachment, Option } from '@slack/types';
import { KaomojiModel } from 'kaomoji/models/kaomoji';
import { ResponseMessage } from 'kaomoji/types/slack';
import _ from 'lodash';

export const createOptionsList = (kaomojis: KaomojiModel[]): { options: Option[] } => {
  return {
    options: kaomojis.map(kaomoji => ({
      text: {
        type: 'plain_text',
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
    replace_original: true,
    text: `Search all kaomoji:`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `Search all kaomoji:`,
        }
      },
      {
        type: 'actions',
        block_id: `${BLOCK_IDS.KAOMOJI_LIST_SELECT}`,
        elements: [{
          type: 'external_select',
          placeholder: {
            type: 'plain_text',
            text: 'Search for a kaomoji to send...',
          },
          action_id: ACTION_IDS.SELECT_KAOMOJI,
          min_query_length: 3,
          initial_option: initialOption,
        }],
      },
      {
        type: 'actions',
        block_id: `${BLOCK_IDS.KAOMOJI_LIST_BUTTONS}`,
        elements: buttonElements,
      },
    ],
  };

};

export function createLegacyListMessage(listCallbackInstance: ListCallbackModel, kaomojiTexts: string[]) {
  const callback_id = listCallbackInstance.callback_id;

  const attachments: MessageAttachment[] = _.map(kaomojiTexts, kaomojiText => {
    const attachment: MessageAttachment = {
      text: kaomojiText,
      callback_id: callback_id,
      actions: [
        {
          name: LEGACY_INTERACTION_LIST.SEND,
          text: 'Send',
          type: 'button',
          style: 'primary',
          value: kaomojiText
        },
        {
          name: LEGACY_INTERACTION_LIST.SAVE_SHORTCUT,
          text: 'Save to Shortcuts',
          type: 'button',
          value: kaomojiText
        }
      ]
    };

    return attachment;
  });

  attachments.push({
    fallback: 'Next or Cancel',
    callback_id: callback_id,
    actions: [
      {
        name: LEGACY_INTERACTION_LIST.NEXT_LIST,
        text: 'Next',
        type: 'button',
        value: 'next'
      },
      {
        name: LEGACY_INTERACTION_LIST.CANCEL,
        text: 'Cancel',
        type: 'button',
        value: 'cancel'
      },
    ]
  });

  const interactiveMessage = {
    response_type: 'ephemeral',
    attachments: attachments
  };

  return interactiveMessage;
}