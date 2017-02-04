var _ = require('lodash');

var INTERACTION_LIST = {
    SEND: 'send',
    NEXT: 'next',
    SAVE: 'save',
    CANCEL: 'cancel'
}

module.exports = {
    INTERACTION_LIST: INTERACTION_LIST,
    createMessage: createMessage
};

function createMessage(interactionCallbackInstance, kaomojiText) {
    var callback_id = interactionCallbackInstance.callback_id;
    var interactiveMessage = {
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
                        name: INTERACTION_LIST.NEXT,
                        text: 'Next',
                        type: 'button',
                        value: 'next'
                    },
                    {
                        name: INTERACTION_LIST.SAVE,
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