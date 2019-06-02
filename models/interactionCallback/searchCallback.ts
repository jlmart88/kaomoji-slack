import mongoose from 'mongoose';

var SearchCallback = new mongoose.Schema({
  offset: Number,
  query: String
});

SearchCallback.virtual('callback_id').get(function () {
  return this._id;
});

export default function (db: typeof mongoose) {
  return db.model('SearchCallback', SearchCallback);
};