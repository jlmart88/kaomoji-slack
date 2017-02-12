var _ = require('lodash');
var interactionConstants = require('../interactions.constants');

module.exports = {
    createShortcutsMessage: createShortcutsMessage
}

function createShortcutsMessage(shortcuts) {
    if (_.isEmpty(shortcuts)) {
        return {
            text: 'You have no shortcuts set! Set a shortcut by clicking "Save" on a kaomoji you like.',
            response_type: 'ephemeral'
        };
    } 

    var callback_id = 0; // we don't need to create an interaction callback, 
                         // because this can only be interacted wtih by clicking send or cancel

    console.log('shortcuts', shortcuts);
    var attachments = _.map(shortcuts, shortcut => {
        var kaomojiText = shortcut.kaomoji_text;
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
                    name: interactionConstants.INTERACTION_LIST.REMOVE_SHORTCUT,
                    text: 'Remove',
                    type: 'button',
                    style: 'danger',
                    value: shortcut._id
                }

            ]
        };
    });

    attachments.push({
        text: 'Close this message',
        callback_id: callback_id,
        attachment_type: 'default',
        actions: [
            {
                name: interactionConstants.INTERACTION_LIST.CANCEL,
                text: 'Close',
                type: 'button',
                value: 'cancel'
            }
        ]
    });
    var interactiveMessage = {
        text: '*Your Kaomoji Shortcuts*',
        attachments: attachments
    };

    return interactiveMessage;
}