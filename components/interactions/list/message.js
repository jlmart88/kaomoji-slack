var _ = require('lodash');

var interactionConstants = require('../constants');

module.exports = {
    createListMessage: createListMessage
};

function createListMessage(listCallbackInstance, kaomojiTexts) {
    var callback_id = listCallbackInstance.callback_id;

    var attachments = _.map(kaomojiTexts, kaomojiText => {
        return {
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
                    name: interactionConstants.INTERACTION_LIST.SAVE_SHORTCUT,
                    text: 'Save to Shortcuts',
                    type: 'button',
                    value: kaomojiText
                }
            ]
        };
    });

    attachments.push({
        fallback: 'Next or Cancel',
        callback_id: callback_id,
        attachment_type: 'default',
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