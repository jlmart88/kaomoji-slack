var express = require('express');
var request = require('request');
var router = express.Router();
var _ = require('lodash');

var UserTokenModel = require('../../models/oauth/userToken');
var InteractionCallbackModel = require('../../models/interactionCallback');

var kaomojiSearch = require('../../components/kaomoji-search');
var kaomojiInteractiveMessage = require('../../components/kaomoji-interactive-message');


router.post('/', (req, res) => {
    var payload = JSON.parse(req.body.payload);
    console.log('interaction', payload);
    // try to get a user token
    var UserToken = UserTokenModel(req.db);
    UserToken.findOne({'user.id': payload.user.id})
        .exec()
        .then(token => {
            if (_.isNil(token)) {
                return res.send('You must <http://12a14799.ngrok.io/oauth/signin|Sign in with Slack> to use the /kaomoji slash command');
            }

            var action = payload.actions[0];
            if (action.name === 'cancel') {
                var slackResponse = {
                    delete_original: true
                };
                return res.send(slackResponse);
            } else if (action.name === 'send') {
                var slackResponse = {
                    delete_original: true
                };
                res.send(slackResponse);

                return request({
                    url: 'https://slack.com/api/chat.postMessage', //URL to hit
                    qs: {
                        token: token.access_token, 
                        channel: payload.channel.id, 
                        text: action.value,
                        as_user: true
                    }, //Query string data
                    method: 'POST', //Specify the method
                }, function (error, response, body) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('chat.postMessage response', body);
                    }
                });
            } else if (action.name === 'next') {
                var InteractionCallback = InteractionCallbackModel(req.db);
                InteractionCallback.findOne({_id: payload.callback_id})
                    .exec()
                    .then(interactionCallbackInstance => {
                        if (_.isNil(interactionCallbackInstance)) throw 'Cannot interact with this message anymore';
                        return [
                            InteractionCallback.create({
                                offset: interactionCallbackInstance.offset + 1, 
                                search: interactionCallbackInstance.search
                            }), 
                            kaomojiSearch.kaomojiSearch(
                                req.db, 
                                interactionCallbackInstance.search, 
                                interactionCallbackInstance.offset
                            )
                        ];
                    })
                    .spread((newInteractionCallbackInstance, kaomoji) => {
                        if (_.isNil(kaomoji)) throw 'No kaomoji found :(';
                        if (_.isNil(newInteractionCallbackInstance)) throw 'Kaomoji experienced an error handling your request';

                        var slackResponse = kaomojiInteractiveMessage.createMessage(newInteractionCallbackInstance, kaomoji.text);
                        return slackResponse;
                    })
                    .catch(err => {
                        console.log(err);
                        var slackResponse = {
                            text: err,
                            response_type: 'ephemeral'
                        };
                        return slackResponse;
                    })
                    .then(result => {
                        res.send(result);
                    });
            } 
        });
});

module.exports = router;
