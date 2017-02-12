var _ = require('lodash');

var shortcut = require('./shortcut.service');
var shortcutMessage = require('./message');

module.exports = {
    saveShortcut: saveShortcut,
    removeShortcut: removeShortcut
}

function saveShortcut(req, res, action) {

    shortcut.hasUserExceededShortcutLimit(req.db, req.user)
        .then(hasExceeded => {
            console.log('hasExceeded', hasExceeded);    
            if (hasExceeded) {
                return res.send({
                    text: 'You have exceeded the shortcut limit of ' + MAX_SHORTCUTS_PER_USER + ', please remove some to add this as a shortcut.',
                    response_type: 'ephemeral',
                    replace_original: false,
                    delete_original: false
                });
            }
            else {
                return shortcut.createShortcut(req.db, req.user, action.value)
                    .then(shortcut => {
                        return res.send({
                            text: 'Kaomoji Shortcut for ' + action.value + ' created.',
                            response_type: 'ephemeral',
                            replace_original: false,
                            delete_original: false
                        });
                    })
                    .catch(err => {
                        if (err.code === 11000) {
                            return res.send({
                                text: 'Kaomoji Shortcut for ' + action.value + ' already exists.',
                                response_type: 'ephemeral',
                                replace_original: false,
                                delete_original: false
                            });    
                        } else {
                            return res.send({
                                text: 'An unknown error occurred while creating your Kaomoji Shortcut.',
                                response_type: 'ephemeral',
                                replace_original: false,
                                delete_original: false
                            })
                        }
                        
                    });
            }
    });
}

function removeShortcut(req, res, action) {
    return shortcut.removeShortcut(req.db, action.value)
        .then(result => {
            return shortcut.getShortcutsForUser(req.db, req.user);
        })
        .then(shortcuts => {
            if (_.isNil(shortcuts)) {
                response = {text:'You have no shortcuts set! Set a shortcut by clicking "Save" on a kaomoji you like.'};    
            } else {
                response = shortcutMessage.createShortcutsMessage(shortcuts);
            }
            _.extend(response, {
                response_type: 'ephemeral',
                delete_original: true
            });
            console.log(response);
            return res.send(response);
        })
        .catch(err => {
            console.error(err);
        });
}          