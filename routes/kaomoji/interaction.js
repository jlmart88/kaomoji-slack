var express = require('express');
var request = require('request');
var router = express.Router();

var _ = require('lodash');

var UserTokenModel = require('../../models/oauth/userToken');
var InteractionCallbackModel = require('../../models/interactionCallback');


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
                res.send('not implemented');
            } 
        });
});

module.exports = router;
