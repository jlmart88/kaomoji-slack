var _ = require('lodash');
var SearchCallbackModel = require('./searchCallback');

module.exports = {
    getSearchCallback: getSearchCallback,
    createSearchCallback: createSearchCallback,
}


function getSearchCallback(db, searchCallbackId) {
    var SearchCallback = SearchCallbackModel(db);

    return SearchCallback.findOne({_id: searchCallbackId}).exec();
}

function createSearchCallback(db, query, offset) {
    var SearchCallback = SearchCallbackModel(db);
     
    return SearchCallback.create({
        offset: offset, 
        query: query
    });
}