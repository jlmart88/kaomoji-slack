import { MessageAttachment } from 'kaomoji/node_modules/@slack/types';
import _ from 'lodash';

var interactionConstants = require('kaomoji/constants');

export default {
  createListMessage: createListMessage
};

function createListMessage(listCallbackInstance, kaomojiTexts: string[]) {
  var callback_id = listCallbackInstance.callback_id;

  var attachments: MessageAttachment[] = _.map(kaomojiTexts, kaomojiText => {
    const attachment: MessageAttachment = {
      text: kaomojiText,
      callback_id: callback_id,
      actions: [
        {
          name: interactionConstants.INTERACTION_LIST.SEND,
          text: 'Send',
          type: 'button',
          style: 'primary',
          value: kaomojiText
        },
        {
          name: interactionConstants.INTERACTION_LIST.SAVE_SHORTCUT,
          text: 'Save to Shortcuts',
          type: 'button',
          value: kaomojiText
        }
      ];

      return attachment
    };
  });

  attachments.push({
    fallback: 'Next or Cancel',
    callback_id: callback_id,
    actions: [
      {
        name: interactionConstants.INTERACTION_LIST.NEXT_LIST,
        text: 'Next',
        type: 'button',
        value: 'next'
      },
      {
        name: interactionConstants.INTERACTION_LIST.CANCEL,
        text: 'Cancel',
        type: 'button',
        value: 'cancel'
      },
    ]
  });

  var interactiveMessage = {
    response_type: 'ephemeral',
    attachments: attachments
  };

  return interactiveMessage;
}