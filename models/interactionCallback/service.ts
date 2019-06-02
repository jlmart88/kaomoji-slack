import _ from 'lodash';
import * as mongoose from 'mongoose';
import SearchCallbackModel from './searchCallback';
import ListCallbackModel from './listCallback';

export default {
  getSearchCallback: getSearchCallback,
  createSearchCallback: createSearchCallback,
  getListCallback: getListCallback,
  createListCallback: createListCallback
}


function getSearchCallback(db: typeof mongoose, searchCallbackId: string) {
  var SearchCallback = SearchCallbackModel(db);

  return SearchCallback.findOne({_id: searchCallbackId}).exec();
}

function createSearchCallback(db: typeof mongoose, query: string, offset: number) {
  var SearchCallback = SearchCallbackModel(db);

  return SearchCallback.create({
    offset: offset,
    query: query
  });
}

function getListCallback(db: typeof mongoose, listCallbackId: string) {
  var ListCallback = ListCallbackModel(db);

  return ListCallback.findOne({_id: listCallbackId}).exec();
}

function createListCallback(db: typeof mongoose, limit: number, offset: number) {
  var ListCallback = ListCallbackModel(db);

  return ListCallback.create({
    limit: limit,
    offset: offset
  });
}