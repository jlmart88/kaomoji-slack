var ShortcutModel = require('.');
var _ = require('lodash');

var MAX_SHORTCUTS_PER_USER = 15;

module.exports = {
    createShortcut: createShortcut,
    removeShortcut: removeShortcut,
    getShortcutsForUser: getShortcutsForUser,
    hasUserExceededShortcutLimit: hasUserExceededShortcutLimit
};

function createShortcut(db, userId, kaomojiText) {
    var Shortcut = ShortcutModel(db);

    return Shortcut.create({user_id: userId, kaomoji_text:kaomojiText});
}

function removeShortcut(db, id) {
    var Shortcut = ShortcutModel(db);

    return Shortcut.remove({_id: id}).exec();
}

// given an userId, will return all of the shortcuts set by that user, or null if there are no shortcuts set
function getShortcutsForUser(db, userId) {
    var Shortcut = ShortcutModel(db);
    
    return Shortcut.collection.find({user_id: userId})
        .toArray()
        .then(array => {
            if (_.isEmpty(array)) return null;
            return array;
        });
}

function hasUserExceededShortcutLimit(db, userId) {
    var Shortcut = ShortcutModel(db);

    return Shortcut.collection.count({user_id: userId})
        .then(count => {
            return count >= MAX_SHORTCUTS_PER_USER;
        });
}
