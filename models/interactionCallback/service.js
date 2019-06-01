var _ = require('lodash');
var SearchCallbackModel = require('./searchCallback');
var ListCallbackModel = require('./listCallback');

module.exports = {
  getSearchCallback: getSearchCallback,
  createSearchCallback: createSearchCallback,
  getListCallback: getListCallback,
  createListCallback: createListCallback
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

function getListCallback(db, listCallbackId) {
  var ListCallback = ListCallbackModel(db);

  return ListCallback.findOne({_id: listCallbackId}).exec();
}

function createListCallback(db, limit, offset) {
  var ListCallback = ListCallbackModel(db);

  return ListCallback.create({
    limit: limit,
    offset: offset
  });
}