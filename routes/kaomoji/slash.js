var express = require('express');
var request = require('request');
var router = express.Router();
var _ = require('lodash');

var SearchCallbackModel = require('../../models/interactionCallback/searchCallback');

var kaomojiCommands = require('../../components/commands');
var search = require('../../components/searchInteractions/search.service');
var searchMessage = require('../../components/searchInteractions/message');
var shortcut = require('../../components/shortcutInteractions/shortcut.service');
var shortcutMessage = require('../../components/shortcutInteractions/message');


var _ = require('lodash');

/* POST kaomoji-search. */
router.post('/', (req, res) => {
    console.log('slash', req.body);
    var query = req.body.text;
    if (query[0] === ':' || query === '') {
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
        case '':
        case kaomojiCommands.COMMAND_LIST.SHORTCUTS:
            return shortcut.getShortcutsForUser(req.db, req.user)
                .then(shortcuts => {
                    response = shortcutMessage.createShortcutsMessage(shortcuts);
                    console.log('command response', response);
                    return res.send(response);
                });
        case kaomojiCommands.COMMAND_LIST.LIST:
            return res.send('listing not implemented');
        default:
            response = _composeEphemeralMessage(kaomojiCommands.getDefaultText(query));
            break;
    }
    console.log('command response', response);
    return res.send(response);
}

function _performInitialKaomojiSearch(req, res, query) {
    var kaomojiText;
    search.getNextSearchResult(req.db, query, 0)
        .then(kaomoji => {
            if (_.isNil(kaomoji)) return res.send('No kaomoji found for "' + query + '".');

            kaomojiText = kaomoji.text;
            var SearchCallback = SearchCallbackModel(req.db);
            return SearchCallback.create({offset:1, query:query});
        })
        .then(searchCallbackInstance => {
            var slackResponse = searchMessage.createSearchMessage(searchCallbackInstance, kaomojiText);
            console.log('slackResponse', slackResponse);
            return slackResponse;
        })
        .catch(err => {
            console.error(err);
            var slackResponse = _composeEphemeralMessage(err);
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
