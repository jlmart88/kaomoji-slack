var _ = require('lodash');

module.exports = {
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
                        name: 'send',
                        text: 'Send',
                        type: 'button',
                        style: 'primary',
                        value: kaomojiText
                    },
                    {
                        name: 'next',
                        text: 'Next',
                        type: 'button',
                        value: 'next'
                    },
                    {
                        name: 'cancel',
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