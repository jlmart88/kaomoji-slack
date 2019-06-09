import ShortcutModel from './index';
import _ from 'lodash';

const MAX_LEGACY_SHORTCUTS_PER_USER = 10;

export const MAX_SHORTCUTS_PER_USER = 100;

export default {
  MAX_LEGACY_SHORTCUTS_PER_USER: MAX_LEGACY_SHORTCUTS_PER_USER,
  createShortcut: createShortcut,
  removeShortcut: removeShortcut,
  getShortcutsForUser: getShortcutsForUser,
};

function createShortcut(userId: string, kaomojiText?: string) {
  return ShortcutModel.create({user_id: userId, kaomoji_text: kaomojiText});
}

function removeShortcut(id?: string) {
  return ShortcutModel.remove({_id: id});
}

// given an userId, will return all of the shortcuts set by that user, or null if there are no shortcuts set
function getShortcutsForUser(userId: string) {
  return ShortcutModel.collection.find({user_id: userId})
    .toArray()
    .then(array => {
      if (_.isEmpty(array)) return null;
      return array;
    });
}

export const hasUserExceededShortcutLimit = (userId: string) => {
  return ShortcutModel.collection.count({user_id: userId})
    .then(count => {
      return count >= MAX_SHORTCUTS_PER_USER;
    });
};
