var interactionConstants = require('kaomoji/constants');

export default {
  createSearchMessage: createSearchMessage
};

function createSearchMessage(searchCallbackInstance, kaomojiText: string) {
  var callback_id = searchCallbackInstance.callback_id;
  var interactiveMessage = {
    response_type: 'ephemeral',
    attachments: [
      {
        text: kaomojiText,
        callback_id: callback_id,
        attachment_type: 'default',
        actions: [
          {
            name: interactionConstants.INTERACTION_LIST.SEND,
            text: 'Send',
            type: 'button',
            style: 'primary',
            value: kaomojiText
          },
          {
            name: interactionConstants.INTERACTION_LIST.NEXT_SEARCH,
            text: 'Next',
            type: 'button',
            value: 'next'
          },
          {
            name: interactionConstants.INTERACTION_LIST.SAVE_SHORTCUT,
            text: 'Save to Shortcuts',
            type: 'button',
            value: kaomojiText
          },
          {
            name: interactionConstants.INTERACTION_LIST.CANCEL,
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