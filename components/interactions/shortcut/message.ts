import { LEGACY_INTERACTION_LIST } from 'kaomoji/components/interactions/constants';
import { MessageAttachment } from 'kaomoji/node_modules/@slack/types';
import _ from 'lodash';

export default {
  createShortcutsMessage: createShortcutsMessage
}

function createShortcutsMessage(shortcuts: any[] | null) {
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