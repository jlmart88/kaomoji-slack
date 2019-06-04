import {
  ACTION_IDS,
  BLOCK_IDS,
  LEGACY_INTERACTION_LIST
} from 'kaomoji/components/interactions/constants';
import { Button, MessageAttachment, Option } from '@slack/types';
import { ShortcutModel } from 'kaomoji/models/shortcut';
import { ResponseMessage } from 'kaomoji/types/slack';
import _ from 'lodash';

export const createShortcutsMessage = (shortcuts: ShortcutModel[] | null, initialOption?: Option): ResponseMessage => {
  if (_.isEmpty(shortcuts) || _.isNil(shortcuts)) {
    return {
      text: 'You have no shortcuts set! Set a shortcut by clicking *Save to Shortcuts* on a kaomoji you like.',
      response_type: 'ephemeral'
    };
  }

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
    const selectedShortcut = _.find(shortcuts, shortcut => shortcut.kaomoji_text === initialOption.value);

    if (selectedShortcut) {
      buttonElements.unshift({
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Remove'
        },
        value: selectedShortcut._id,
        action_id: ACTION_IDS.REMOVE_SHORTCUT,
        style: 'danger',
      } as any);
    }

    buttonElements.unshift({
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Send',
      },
      value: initialOption.value,
      action_id: ACTION_IDS.SEND_KAOMOJI,
      style: 'primary',
    } as any);
  }

  return {
    response_type: 'ephemeral',
    replace_original: true,
    text: `Here are your kaomoji shortcuts:`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `Here are your kaomoji shortcuts:`,
        }
      },
      {
        type: 'actions',
        block_id: `${BLOCK_IDS.KAOMOJI_SHORTCUTS_SELECT}`,
        elements: [{
          type: 'static_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select a kaomoji to send...',
          },
          action_id: ACTION_IDS.SELECT_KAOMOJI,
          options: shortcuts.map(shortcut => ({
            text: {
              type: 'plain_text',
              text: shortcut.kaomoji_text,
              emoji: false,
            },
            value: shortcut.kaomoji_text
          })),
          initial_option: initialOption,
        }],
      },
      {
        type: 'actions',
        block_id: `${BLOCK_IDS.KAOMOJI_SHORTCUTS_BUTTONS}`,
        elements: buttonElements,
      },
    ],
  };
};


export function createLegacyShortcutsMessage(shortcuts: any[] | null) {
  if (_.isEmpty(shortcuts)) {
    return {
      text: 'You have no shortcuts set! Set a shortcut by clicking *Save to Shortcuts* on a kaomoji you like.',
      response_type: 'ephemeral'
    };
  }

  const callback_id = '0'; // we don't need to create an interaction callback,
                       // because this can only be interacted with by clicking send or cancel

  console.log('shortcuts', shortcuts);
  const attachments: MessageAttachment[] = _.map(shortcuts, shortcut => {
    const kaomojiText = shortcut.kaomoji_text;
    const attachment: MessageAttachment = {
      text: kaomojiText,
      fallback: '',
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
          name: LEGACY_INTERACTION_LIST.REMOVE_SHORTCUT,
          text: 'Remove',
          type: 'button',
          style: 'danger',
          value: shortcut._id
        }
      ]
    };
    return attachment;
  });

  attachments.push({
    fallback: 'Close',
    callback_id: callback_id,
    actions: [
      {
        name: LEGACY_INTERACTION_LIST.CANCEL,
        text: 'Close',
        type: 'button',
        value: 'cancel'
      }
    ]
  });
  const interactiveMessage = {
    text: '*Your Kaomoji Shortcuts*',
    response_type: 'ephemeral',
    attachments: attachments
  };

  return interactiveMessage;
}