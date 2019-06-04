import { LEGACY_INTERACTION_LIST } from 'kaomoji/components/interactions/constants';
import { ListCallbackModel } from 'kaomoji/models/interactionCallback/listCallback';
import { MessageAttachment } from '@slack/types';
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