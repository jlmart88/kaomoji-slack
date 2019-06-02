import { Document, Model } from 'mongoose';
import * as mongoose from 'mongoose';

export interface ListCallbackModel extends Document {
  offset: number;
  limit: number;
  callback_id: string;
}

const ListCallback = new mongoose.Schema({
  offset: Number,
  limit: Number
});

ListCallback.virtual('callback_id').get(function (this: ListCallbackModel) {
  return this._id;
});

export default mongoose.model('ListCallback', ListCallback) as Model<ListCallbackModel>;