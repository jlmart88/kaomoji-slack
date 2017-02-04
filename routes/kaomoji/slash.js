var express = require('express');
var request = require('request');
var router = express.Router();
var _ = require('lodash');

var InteractionCallbackModel = require('../../models/interactionCallback');

var kaomojiCommands = require('../../components/kaomoji-commands');
var kaomojiSearch = require('../../components/kaomoji-search');
var kaomojiInteractions = require('../../components/kaomoji-interactions');

var _ = require('lodash');

/* POST kaomoji-search. */
router.post('/', (req, res) => {
    console.log('slash', req.body);
    var query = req.body.text;
    if (query[0] === ':') {
        return _performCommand(req, res, query);
    } else {
        return _performInitialKaomojiSearch(req, res, query);
    }
});

function _performCommand(req, res, query) {
    console.log('performing command', query);
    var response = '';

    switch (query) {
        case kaomojiCommands.COMMAND_LIST.HELP:
            response = _composeEphemeralMessage(kaomojiCommands.getHelpText());
            break;
        default:
            response = _composeEphemeralMessage(kaomojiCommands.getDefaultText(query));
            break;
    }
    console.log('command response', response);

    return res.send(response);
}

function _performInitialKaomojiSearch(req, res, query) {
    var kaomojiText;
    kaomojiSearch.kaomojiSearch(req.db, query, 0)
        .then(kaomoji => {
            if (_.isNil(kaomoji)) throw 'No kaomoji found :(';

            kaomojiText = kaomoji.text;
            var InteractionCallback = InteractionCallbackModel(req.db);
            return InteractionCallback.create({offset:1, search:query});
        })
        .then(interactionCallbackInstance => {
            var slackResponse = kaomojiInteractions.createMessage(interactionCallbackInstance, kaomojiText);
            console.log('slackResponse', slackResponse);
            return slackResponse;
        })
        .catch(err => {
            console.error(err);
            var slackResponse = composeEphemeralMessage(err);
            return slackResponse;
        })
        .then(result => {
            return res.send(result);
        });
}

function _composeEphemeralMessage(message) {
    return {
        text: message,
        response_type: 'ephemeral'
    };
}

module.exports = router;
