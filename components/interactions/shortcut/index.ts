import _ from 'lodash';

var shortcut = require('kaomoji/models/shortcut/service');
var shortcutMessage = require('./message');
var kaomojiCommands = require('kaomoji/commands');

export default {
  saveShortcut: saveShortcut,
  removeShortcut: removeShortcut,
  sendShortcutsMessage: sendShortcutsMessage
}

function sendShortcutsMessage(req, res) {
  return shortcut.getShortcutsForUser(req.db, req.user)
    .then(shortcuts => {
      response = shortcutMessage.createShortcutsMessage(shortcuts);

      _.extend(response, {
        delete_original: true
      });

      return res.send(response);
    })
    .catch(err => {
      console.error(err);
      return res.send(err);
    });
}

function saveShortcut(req, res, action) {

  shortcut.hasUserExceededShortcutLimit(req.db, req.user)
    .then(hasExceeded => {
      if (hasExceeded) {
        return res.send({
          text: 'You have reached the shortcut limit of ' + shortcut.MAX_SHORTCUTS_PER_USER + ', remove one to add ' + action.value + ' as a shortcut.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
          response_type: 'ephemeral',
          replace_original: false,
          delete_original: false
        });
      }

      return shortcut.createShortcut(req.db, req.user, action.value)
        .then(shortcut => {
          return res.send({
            text: 'A kaomoji shortcut for ' + action.value + ' has been created.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
            response_type: 'ephemeral',
            replace_original: false,
            delete_original: false
          });
        })
        .catch(err => {
          if (err.code === 11000) {
            return res.send({
              text: 'A kaomoji shortcut for ' + action.value + ' already exists.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
              response_type: 'ephemeral',
              replace_original: false,
              delete_original: false
            });
          } else {
            return res.send({
              text: 'An unknown error occurred while creating your kaomoji shortcut.',
              response_type: 'ephemeral',
              replace_original: false,
              delete_original: false
            })
          }

        });
    });
}

function removeShortcut(req, res, action) {
  return shortcut.removeShortcut(req.db, action.value)
    .then(result => {
      sendShortcutsMessage(req, res);
    });
}          