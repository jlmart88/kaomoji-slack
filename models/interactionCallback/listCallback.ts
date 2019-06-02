import mongoose from 'mongoose';

var ListCallback = new mongoose.Schema({
  offset: Number,
  limit: Number
});

ListCallback.virtual('callback_id').get(function () {
  return this._id;
});

export default function (db: typeof mongoose) {
  return db.model('ListCallback', ListCallback);
};