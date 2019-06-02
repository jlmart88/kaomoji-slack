import * as mongoose from 'mongoose';
import ShortcutModel from '.';
import _ from 'lodash';

const MAX_SHORTCUTS_PER_USER = 10;

export default {
  MAX_SHORTCUTS_PER_USER: MAX_SHORTCUTS_PER_USER,
  createShortcut: createShortcut,
  removeShortcut: removeShortcut,
  getShortcutsForUser: getShortcutsForUser,
  hasUserExceededShortcutLimit: hasUserExceededShortcutLimit
};

function createShortcut(db: typeof mongoose, userId: string, kaomojiText: string) {
  var Shortcut = ShortcutModel(db);

  return Shortcut.create({user_id: userId, kaomoji_text: kaomojiText});
}

function removeShortcut(db: typeof mongoose, id: string) {
  var Shortcut = ShortcutModel(db);

  return Shortcut.remove({_id: id});
}

// given an userId, will return all of the shortcuts set by that user, or null if there are no shortcuts set
function getShortcutsForUser(db: typeof mongoose, userId: string) {
  var Shortcut = ShortcutModel(db);

  return Shortcut.collection.find({user_id: userId})
    .toArray()
    .then(array => {
      if (_.isEmpty(array)) return null;
      return array;
    });
}

function hasUserExceededShortcutLimit(db: typeof mongoose, userId: string) {
  var Shortcut = ShortcutModel(db);

  return Shortcut.collection.count({user_id: userId})
    .then(count => {
      return count >= MAX_SHORTCUTS_PER_USER;
    });
}
