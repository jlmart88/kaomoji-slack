import { INTERACTION_LIST } from 'kaomoji/components/interactions/constants';
import { SearchCallbackModel } from 'kaomoji/models/interactionCallback/searchCallback';

export default {
  createSearchMessage: createSearchMessage
};

function createSearchMessage(searchCallbackInstance: SearchCallbackModel, kaomojiText: string) {
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
            name: INTERACTION_LIST.SEND,
            text: 'Send',
            type: 'button',
            style: 'primary',
            value: kaomojiText
          },
          {
            name: INTERACTION_LIST.NEXT_SEARCH,
            text: 'Next',
            type: 'button',
            value: 'next'
          },
          {
            name: INTERACTION_LIST.SAVE_SHORTCUT,
            text: 'Save to Shortcuts',
            type: 'button',
            value: kaomojiText
          },
          {
            name: INTERACTION_LIST.CANCEL,
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