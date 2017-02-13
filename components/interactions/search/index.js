var _ = require('lodash');

var searchMessage = require('./message');
var interactionCallback = require('../../../models/interactionCallback/service');
var kaomoji = require('../../../models/kaomoji/service');

var Promise = require('bluebird');

module.exports = {
    sendSearchMessage: sendSearchMessage
}

function sendSearchMessage(req, res, query) {
    var searchParamsCallback;
    if (_.isNil(query)) {
        var searchCallbackId = req.payload.callback_id;
        searchParamsCallback = interactionCallback.getSearchCallback(req.db, searchCallbackId)
            .then(searchCallback => {
                if (_.isNil(searchCallback)) throw 'Cannot interact with this message anymore';
                return [searchCallback.query, searchCallback.offset];
            });
    } else {
        searchParamsCallback = Promise.resolve([query, 0]);
    }

    return searchParamsCallback.spread((query, offset) => {
            return [
                interactionCallback.createSearchCallback(req.db, query, offset + 1),
                kaomoji.getSearchResults(
                    req.db, 
                    query,
                    offset,
                    1
                )
            ];
        })
        .spread((searchCallback, kaomojis) => {
            if (_.isNil(kaomojis)) throw 'No kaomoji found for "' + query + '".';
            if (_.isNil(searchCallback)) throw 'Kaomoji App experienced an error handling your request';

            var slackResponse = searchMessage.createSearchMessage(searchCallback, kaomojis[0].text);
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
