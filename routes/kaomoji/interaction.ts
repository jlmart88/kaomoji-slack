import express from 'express';
import { config } from 'kaomoji/config';
import { Request, Response } from 'kaomoji/node_modules/@types/express';
import request from 'request';
var router = express.Router();

import shortcutInteractions from 'kaomoji/components/interactions/shortcut';
import searchInteractions from 'kaomoji/components/interactions/search';
import listInteractions from 'kaomoji/components/interactions/list';
import interactionConstants from 'kaomoji/components/interactions/constants';
import oauth from 'kaomoji/models/oauth/service';
import kaomojiCommands from 'kaomoji/components/commands';


router.post('/', (req, res) => {
  console.log('interaction', req.payload);
  var action = req.payload.actions[0];
  switch (action.name) {
    case interactionConstants.INTERACTION_LIST.SEND:
      return _sendMessageAsUser(req, res, action.value);

    case interactionConstants.INTERACTION_LIST.CANCEL:
      return _cancelInteractiveMessage(req, res);

    case interactionConstants.INTERACTION_LIST.SAVE_SHORTCUT:
      console.log('interaction: saving shortcut');
      return shortcutInteractions.saveShortcut(req, res, action);

    case interactionConstants.INTERACTION_LIST.REMOVE_SHORTCUT:
      console.log('interaction: removing shortcut');
      return shortcutInteractions.removeShortcut(req, res, action);

    case interactionConstants.INTERACTION_LIST.NEXT_SEARCH:
      return searchInteractions.sendSearchMessage(req, res);

    case interactionConstants.INTERACTION_LIST.NEXT_LIST:
      return listInteractions.sendListMessage(req, res);
  }
});

export default router;

function _cancelInteractiveMessage(req: Request, res: Response) {
  var slackResponse = {
    delete_original: true
  };
  return res.send(slackResponse);
}

function _sendMessageAsUser(req: Request, res: Response, text: string) {

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
        return oauth.deleteUserToken(req.db, req.token.id).then(() => {
          return res.send(kaomojiCommands.getNoUserTokenText(config.SERVER_URL));
        });
      } else {
        var slackResponse = {
          delete_original: true
        };
        return res.send(slackResponse);
      }
    }
  });
}
