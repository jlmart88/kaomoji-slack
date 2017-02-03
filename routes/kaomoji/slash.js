var express = require('express');
var request = require('request');
var router = express.Router();
var UserTokenModel = require('../../models/oauth/userToken');
var InteractionCallbackModel = require('../../models/interactionCallback');
var kaomojiSearch = require('../../components/kaomoji-search');

var _ = require('lodash');

/* POST kaomoji-search. */
router.post('/', (req, res) => {
    console.log('slash', req.body);
    // try to get a user token
    var UserToken = UserTokenModel(req.db);
    UserToken.findOne({'user.id': req.body.user_id})
        .exec()
        .then(token => {
            if (_.isNil(token)) {
                return res.send('You must <http://12a14799.ngrok.io/oauth/signin|Sign in with Slack> to use the /kaomoji slash command');
            }

            var kaomojiText;
            kaomojiSearch.kaomojiSearch(req.db, req.body.text, 0)
                .then(kaomoji => {
                    if (_.isNil(kaomoji)) throw 'No kaomoji found :(';

                    kaomojiText = kaomoji.text;
                    var InteractionCallback = InteractionCallbackModel(req.db);
                    return InteractionCallback.create({offset:1, search:req.body.text});
                })
                .then(interactionCallbackInstance => {
                    var callback_id = interactionCallbackInstance.callback_id;
                    var slackResponse = {
                        attachments: [
                            {
                                text: kaomojiText,
                                callback_id: callback_id,
                                attachment_type: 'default',
                                actions: [
                                    {
                                        name: 'send',
                                        text: 'Send',
                                        type: 'button',
                                        style: 'primary',
                                        value: kaomojiText
                                    },
                                    {
                                        name: 'next',
                                        text: 'Next',
                                        type: 'button',
                                        value: 'next'
                                    },
                                    {
                                        name: 'cancel',
                                        text: 'Cancel',
                                        type: 'button',
                                        value: 'cancel'
                                    },
                                ]
                            }
                        ]    
                    };
                    console.log('slackResponse', slackResponse);
                    return slackResponse;
                })
                .catch(err => {
                    var slackResponse = {
                        text: err,
                        response_type: 'ephemeral'
                    };
                    return slackResponse;
                })
                .then(result => {
                    res.send(result);
                });
        });
});

module.exports = router;
