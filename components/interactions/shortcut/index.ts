import { AttachmentAction } from 'kaomoji/node_modules/@slack/types';
import { Request, Response } from 'express';
import _ from 'lodash';

import shortcut from 'kaomoji/models/shortcut/service';
import shortcutMessage from './message';
import kaomojiCommands from 'kaomoji/components/commands';

export default {
  saveShortcut: saveShortcut,
  removeShortcut: removeShortcut,
  sendShortcutsMessage: sendShortcutsMessage
}

function sendShortcutsMessage(req: Request, res: Response) {
  return shortcut.getShortcutsForUser(req.user)
    .then(shortcuts => {
      let response = shortcutMessage.createShortcutsMessage(shortcuts);

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

function saveShortcut(req: Request, res: Response, action: AttachmentAction) {

  shortcut.hasUserExceededShortcutLimit(req.user)
    .then(hasExceeded => {
      if (hasExceeded) {
        return res.send({
          text: 'You have reached the shortcut limit of ' + shortcut.MAX_SHORTCUTS_PER_USER + ', remove one to add ' + action.value + ' as a shortcut.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
          response_type: 'ephemeral',
          replace_original: false,
          delete_original: false
        });
      }

      return shortcut.createShortcut(req.user, action.value)
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

function removeShortcut(req: Request, res: Response, action: AttachmentAction) {
  return shortcut.removeShortcut(action.value)
    .then(result => {
      sendShortcutsMessage(req, res);
    });
}          