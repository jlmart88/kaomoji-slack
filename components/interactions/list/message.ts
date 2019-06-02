import { INTERACTION_LIST } from 'kaomoji/components/interactions/constants';
import { ListCallbackModel } from 'kaomoji/models/interactionCallback/listCallback';
import { MessageAttachment } from 'kaomoji/node_modules/@slack/types';
import _ from 'lodash';

export default {
  createListMessage: createListMessage
};

function createListMessage(listCallbackInstance: ListCallbackModel, kaomojiTexts: string[]) {
  const callback_id = listCallbackInstance.callback_id;

  const attachments: MessageAttachment[] = _.map(kaomojiTexts, kaomojiText => {
    const attachment: MessageAttachment = {
      text: kaomojiText,
      callback_id: callback_id,
      actions: [
        {
          name: INTERACTION_LIST.SEND,
          text: 'Send',
          type: 'button',
          style: 'primary',
          value: kaomojiText
        },
        {
          name: INTERACTION_LIST.SAVE_SHORTCUT,
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
        name: INTERACTION_LIST.NEXT_LIST,
        text: 'Next',
        type: 'button',
        value: 'next'
      },
      {
        name: INTERACTION_LIST.CANCEL,
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