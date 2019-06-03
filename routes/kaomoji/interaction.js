var express = require('express');
var request = require('request');
var router = express.Router();
var _ = require('lodash');

var shortcutInteractions = require('../../components/interactions/shortcut');
var searchInteractions = require('../../components/interactions/search');
var listInteractions = require('../../components/interactions/list');
var interactionConstants = require('../../components/interactions/constants');
var oauth = require('../../models/oauth/service');
var kaomojiCommands = require('../../components/commands');


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

module.exports = router;

function _cancelInteractiveMessage(req, res) {
  var slackResponse = {
    delete_original: true
  };
  return res.send(slackResponse);
}

function _sendMessageAsUser(req, res, text) {

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
          return res.send(kaomojiCommands.getNoUserTokenText(req.config.SERVER_URL));
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
