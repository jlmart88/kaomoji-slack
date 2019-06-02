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


function getSearchCallback(searchCallbackId: string) {
  const SearchCallback = SearchCallbackModel;

  return SearchCallback.findOne({_id: searchCallbackId}).exec();
}

function createSearchCallback(query: string, offset: number) {
  const SearchCallback = SearchCallbackModel;

  return SearchCallback.create({
    offset: offset,
    query: query
  });
}

function getListCallback(listCallbackId: string) {
  const ListCallback = ListCallbackModel;

  return ListCallback.findOne({_id: listCallbackId}).exec();
}

function createListCallback(limit: number, offset: number) {
  const ListCallback = ListCallbackModel;

  return ListCallback.create({
    limit: limit,
    offset: offset
  });
}