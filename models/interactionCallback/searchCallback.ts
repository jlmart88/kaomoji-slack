import { Document, Model } from 'mongoose';
import * as mongoose from 'mongoose';

export interface SearchCallbackModel extends Document {
  offset: number;
  query: string;
  callback_id: string;
}

const SearchCallback = new mongoose.Schema({
  offset: Number,
  query: String
});

SearchCallback.virtual('callback_id').get(function (this: SearchCallbackModel) {
  return this._id;
});

export default mongoose.model('SearchCallback', SearchCallback) as Model<SearchCallbackModel>;
