var express = require('express');
var request = require('request');
var router = express.Router();
var _ = require('lodash');

var UserTokenModel = require('../../models/oauth/userToken');
var InteractionCallbackModel = require('../../models/interactionCallback');

var kaomojiSearch = require('../../components/kaomoji-search');
var kaomojiInteractions = require('../../components/kaomoji-interactions');


router.post('/', (req, res) => {
    
    console.log('interaction', req.payload);
    var action = req.payload.actions[0];
    switch (action.name) {
        case kaomojiInteractions.INTERACTION_LIST.CANCEL:
            var slackResponse = {
                delete_original: true
            };
            return res.send(slackResponse);
        case kaomojiInteractions.INTERACTION_LIST.SEND:
            var slackResponse = {
                delete_original: true
            };
            res.send(slackResponse);

            return request({
                url: 'https://slack.com/api/chat.postMessage', //URL to hit
                qs: {
                    token: req.token.access_token, 
                    channel: req.payload.channel.id, 
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
        case kaomojiInteractions.INTERACTION_LIST.NEXT:
            var InteractionCallback = InteractionCallbackModel(req.db);
            return InteractionCallback.findOne({_id: req.payload.callback_id})
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

                    var slackResponse = kaomojiInteractions.createMessage(newInteractionCallbackInstance, kaomoji.text);
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
                    return res.send(result);
                });
    }    
});

module.exports = router;
