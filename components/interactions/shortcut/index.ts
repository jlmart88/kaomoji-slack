import { respondToInteractiveAction } from 'kaomoji/components/interactions/utils';
import { AttachmentAction } from '@slack/types';
import { Request, Response } from 'express';
import { ResponseMessage } from 'kaomoji/types/slack';
import _ from 'lodash';

import shortcut, { MAX_SHORTCUTS_PER_USER } from 'kaomoji/models/shortcut/service';
import shortcutMessage from './message';
import kaomojiCommands from 'kaomoji/components/commands';

export const saveShortcut = async (req: Request, res: Response, kaomoji?: string) => {
  let message: ResponseMessage;
  if (!kaomoji) {
    message = {
      text: 'An unknown error occurred while creating your kaomoji shortcut.',
      response_type: 'ephemeral',
      replace_original: false,
    };
    respondToInteractiveAction(req, message);
    return res.send({ text: message.text });
  }

  const hasExceeded = await shortcut.hasUserExceededShortcutLimit(req.user);
  if (hasExceeded) {
    message = {
      text: 'You have reached the shortcut limit of ' + MAX_SHORTCUTS_PER_USER + ', remove one to add ' + kaomoji + ' as a shortcut.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
      response_type: 'ephemeral',
      replace_original: false,
    };
    respondToInteractiveAction(req,message);
    return res.send({ text: message.text });
  }

  try {
    await shortcut.createShortcut(req.user, kaomoji);
    message = {
      text: 'A kaomoji shortcut for ' + kaomoji + ' has been created.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
      response_type: 'ephemeral',
      replace_original: false,
    };
  } catch (err) {
    if (err.code === 11000) {
      message = {
        text: 'A kaomoji shortcut for ' + kaomoji + ' already exists.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
        response_type: 'ephemeral',
        replace_original: false,
      };
    } else {
      message = {
        text: 'An unknown error occurred while creating your kaomoji shortcut.',
        response_type: 'ephemeral',
        replace_original: false,
      };
    }
  }
  respondToInteractiveAction(req, message);
  return res.send({ text: message.text });
};

export function sendShortcutsMessage(req: Request, res: Response) {
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

export function saveLegacyShortcut(req: Request, res: Response, action: AttachmentAction) {

  shortcut.hasUserExceededShortcutLimit(req.user)
    .then(hasExceeded => {
      if (hasExceeded) {
        return res.send({
          text: 'You have reached the shortcut limit of ' + shortcut.MAX_LEGACY_SHORTCUTS_PER_USER + ', remove one to add ' + action.value + ' as a shortcut.' + '\n' + kaomojiCommands.getShortcutsUsageText(),
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

export function removeLegacyShortcut(req: Request, res: Response, action: AttachmentAction) {
  return shortcut.removeShortcut(action.value)
    .then(result => {
      sendShortcutsMessage(req, res);
    });
}          