import ListCallbackModel from './listCallback';

export default {
  getListCallback: getListCallback,
  createListCallback: createListCallback
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