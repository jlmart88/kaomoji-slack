import express from 'express';
import { config } from 'kaomoji/config';
import { AttachmentAction, Button, KnownAction } from 'kaomoji/node_modules/@slack/types';
import { Request, Response } from 'express';
import { ResponseMessage } from 'kaomoji/types/slack';
import request from 'request';
const router = express.Router();

import { sendLegacySearchMessage, sendSearchMessage } from 'kaomoji/components/interactions/search';
import shortcutInteractions from 'kaomoji/components/interactions/shortcut';
import listInteractions from 'kaomoji/components/interactions/list';
import { ACTION_IDS, LEGACY_INTERACTION_LIST } from 'kaomoji/components/interactions/constants';
import oauth from 'kaomoji/models/oauth/service';
import kaomojiCommands from 'kaomoji/components/commands';


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
        console.log('interaction: saving shortcut');
        return shortcutInteractions.saveShortcut(req, res, attachmentAction);

      case LEGACY_INTERACTION_LIST.REMOVE_SHORTCUT:
        console.log('interaction: removing shortcut');
        return shortcutInteractions.removeShortcut(req, res, attachmentAction);

      case LEGACY_INTERACTION_LIST.NEXT_SEARCH:
        return sendLegacySearchMessage(req, res);

      case LEGACY_INTERACTION_LIST.NEXT_LIST:
        return listInteractions.sendListMessage(req, res);
    }
  }
  // then try treating the action as a KnownAction
  else if (req.payload.type === 'block_actions') {
    const action: KnownAction = req.payload.actions[0];
    switch (action.action_id) {
      case ACTION_IDS.SELECT_KAOMOJI:
        return sendSearchMessage(req, res);
      case ACTION_IDS.CANCEL:
        return _cancelInteractiveMessage(req, res);
      case ACTION_IDS.SEND_KAOMOJI:
        return _sendKaomojiAsUser(req, res, (action as Button).value);
      case ACTION_IDS.SAVE_SHORTCUT:
        // TODO: support saving shortcut from block action
        // return shortcutInteractions.saveShortcut(req, res, action);
    }
  }
});

export default router;

const _sendResponseMessage = (req: Request, message: Partial<ResponseMessage>) => {
  const { response_url: url } = req.payload;
  return request({
    url,
    body: message,
    json: true,
    method: 'POST',
  });
};

const _cancelInteractiveMessage = (req: Request, res?: Response) => {
  const slackResponse: Partial<ResponseMessage> = {
    delete_original: true,
  };
  res && res.send({ text: 'Cancelling message' });
  return _sendResponseMessage(req, slackResponse);
};

const _sendKaomojiAsUser = (req: Request, res: Response, text?: string) => {
  res.send({ text: 'Sending kaomoji as user' });
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
      return _sendResponseMessage(req, error);
    } else {
      console.log('chat.postMessage response', body);
      body = JSON.parse(body);
      if (!body.ok) {
        return oauth.deleteUserToken(req.token.id).then(() => {
          return _sendResponseMessage(req, {
            text: kaomojiCommands.getNoUserTokenText(config.SERVER_URL),
          });
        });
      } else {
        _cancelInteractiveMessage(req);
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
