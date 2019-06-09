import express, { Request, Response } from 'express';
import kaomojiCommands from 'kaomoji/components/commands';
import {
  ACTION_IDS,
  BLOCK_ID_PREFIX_DELIMITER, BLOCK_IDS,
  LEGACY_INTERACTION_LIST
} from 'kaomoji/components/interactions/constants';
import { sendLegacyListMessage, sendListMessage } from 'kaomoji/components/interactions/list';
import { sendSearchMessage } from 'kaomoji/components/interactions/search';
import {
  removeShortcut,
  saveLegacyShortcut,
  saveShortcut,
  sendShortcutsMessage
} from 'kaomoji/components/interactions/shortcut';
import { cancelInteractiveMessage, respondToInteractiveAction } from 'kaomoji/components/interactions/utils';
import { config } from 'kaomoji/config';
import oauth from 'kaomoji/models/oauth/service';
import { AttachmentAction, Button } from '@slack/types';
import request from 'request';

const router = express.Router();


router.post('/', (req, res) => {
  console.log('interaction', req.payload);

  // first try treating the action as a legacy AttachmentAction
  if (req.payload.type === 'interactive_message') {
    const attachmentAction: AttachmentAction = req.payload.actions[0];
    switch (attachmentAction.name) {
      case LEGACY_INTERACTION_LIST.SEND:
        return _sendLegacyMessageAsUser(req, res, attachmentAction.value);

      case LEGACY_INTERACTION_LIST.CANCEL:
        return _cancelLegacyInteractiveMessage(req, res);

      case LEGACY_INTERACTION_LIST.SAVE_SHORTCUT:
        return saveLegacyShortcut(req, res, attachmentAction);

      case LEGACY_INTERACTION_LIST.REMOVE_SHORTCUT:
        // this has been deprecated, so just cancel the legacy interactive message that triggered it
        return _cancelLegacyInteractiveMessage(req, res);

      case LEGACY_INTERACTION_LIST.NEXT_SEARCH:
        // this has been deprecated, so just cancel the legacy interactive message that triggered it
        return _cancelLegacyInteractiveMessage(req, res);

      case LEGACY_INTERACTION_LIST.NEXT_LIST:
        return sendLegacyListMessage(req, res);
    }
  }
  // then try treating the action as a KnownAction
  else if (req.payload.type === 'block_actions') {
    const action: any = req.payload.actions[0];
    switch (action.action_id) {
      case ACTION_IDS.SELECT_KAOMOJI:
        switch (action.block_id.split(BLOCK_ID_PREFIX_DELIMITER)[0]) {
          case BLOCK_IDS.KAOMOJI_LIST_SELECT:
            return sendListMessage(req, res);
          case BLOCK_IDS.KAOMOJI_SEARCH_SELECT:
            return sendSearchMessage(req, res);
          case BLOCK_IDS.KAOMOJI_SHORTCUTS_SELECT:
          default:
            return sendShortcutsMessage(req, res);
        }
      case ACTION_IDS.REMOVE_SHORTCUT:
        return removeShortcut(req, res);
      case ACTION_IDS.CANCEL:
        return cancelInteractiveMessage(req, res);
      case ACTION_IDS.SEND_KAOMOJI:
        return _sendKaomojiAsUser(req, res, (action as Button).value);
      case ACTION_IDS.SAVE_SHORTCUT:
        return saveShortcut(req, res, (action as Button).value);
    }
  }
});

export default router;

const _sendKaomojiAsUser = (req: Request, res: Response, text?: string) => {
  res.send({ text: 'Sending kaomoji as user' });
  return request({
    url: 'https://slack.com/api/chat.postMessage', //URL to hit
    qs: {
      token: req.token.access_token,
      channel: req.payload.channel.id,
      text,
      blocks: JSON.stringify([{
        type: 'section',
        text: {
          type: 'plain_text',
          text,
          emoji: false,
        }
      }], null, 0),
      as_user: true
    }, //Query string data
    method: 'POST', //Specify the method
  }, function (error, response, body) {
    if (error) {
      console.error(error);
      return respondToInteractiveAction(req, error);
    } else {
      console.log('chat.postMessage response', body);
      body = JSON.parse(body);
      if (!body.ok) {
        return oauth.deleteUserToken(req.token.id).then(() => {
          return respondToInteractiveAction(req, {
            text: kaomojiCommands.getNoUserTokenText(config.SERVER_URL),
          });
        });
      } else {
        cancelInteractiveMessage(req);
      }
    }
  });
};

function _cancelLegacyInteractiveMessage(req: Request, res: Response) {
  const slackResponse = {
    delete_original: true
  };
  return res.send(slackResponse);
}

function _sendLegacyMessageAsUser(req: Request, res: Response, text?: string) {

  return request({
    url: 'https://slack.com/api/chat.postMessage', //URL to hit
    qs: {
      token: req.token.access_token,
      channel: req.payload.channel.id,
      text: text,
      as_user: true
    }, //Query string data
    method: 'POST', //Specify the method
  }, function (error, response, body) {
    if (error) {
      console.error(error);
      res.send(error);
    } else {
      console.log('chat.postMessage response', body);
      body = JSON.parse(body);
      if (!body.ok) {
        return oauth.deleteUserToken(req.token.id).then(() => {
          return res.send(kaomojiCommands.getNoUserTokenText(config.SERVER_URL));
        });
      } else {
        const slackResponse = {
          delete_original: true
        };
        return res.send(slackResponse);
      }
    }
  });
}
