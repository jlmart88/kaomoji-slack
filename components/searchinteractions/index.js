var _ = require('lodash');

var searchMessage = require('./message');
var SearchCallbackModel = require('../../models/interactionCallback/searchCallback');
var search = require('./search.service');

module.exports = {
    getNextResult: getNextResult
}

function getNextResult(req, res, action) {
    var SearchCallback = SearchCallbackModel(req.db);
    return SearchCallback.findOne({_id: req.payload.callback_id})
        .exec()
        .then(searchCallbackInstance => {
            if (_.isNil(searchCallbackInstance)) throw 'Cannot interact with this message anymore';
            return [
                SearchCallback.create({
                    offset: searchCallbackInstance.offset + 1, 
                    query: searchCallbackInstance.query
                }), 
                search.getNextSearchResult(
                    req.db, 
                    searchCallbackInstance.query, 
                    searchCallbackInstance.offset
                )
            ];
        })
        .spread((newSearchCallbackInstance, kaomoji) => {
            if (_.isNil(kaomoji)) throw 'No kaomoji found :(';
            if (_.isNil(newSearchCallbackInstance)) throw 'Kaomoji experienced an error handling your request';

            var slackResponse = searchMessage.createSearchMessage(newSearchCallbackInstance, kaomoji.text);
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