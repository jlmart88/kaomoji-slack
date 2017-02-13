var express = require('express');
var request = require('request');
var router = express.Router();
var _ = require('lodash');

var SearchCallbackModel = require('../../models/interactionCallback/searchCallback');

var kaomojiCommands = require('../../components/commands');
var kaomoji = require('../../models/kaomoji/service');
var searchInteractions = require('../../components/interactions/search');
var shortcutInteractions = require('../../components/interactions/shortcut');


/* POST kaomoji-search. */
router.post('/', (req, res) => {
    console.log('slash', req.body);
    var query = req.body.text;
    if (kaomojiCommands.isCommandQuery(query)) {
        return _performCommand(req, res, query);
    } else {
        return searchInteractions.sendSearchMessage(req, res, query);
    }
});

function _performCommand(req, res, query) {
    console.log('performing command', query);
    var response = '';

    switch (query) {
        case kaomojiCommands.COMMAND_LIST.EMPTY:
        case kaomojiCommands.COMMAND_LIST.SHORTCUTS:
            return shortcutInteractions.sendShortcutsMessage(req, res);
        case kaomojiCommands.COMMAND_LIST.LIST:
            return res.send('listing not implemented');
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

function _composeEphemeralMessage(message) {
    return {
        text: message,
        response_type: 'ephemeral'
    };
}

module.exports = router;
