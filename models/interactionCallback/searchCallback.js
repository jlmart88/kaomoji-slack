var mongoose = require('mongoose');

var SearchCallback = new mongoose.Schema({
  offset: Number,
  query: String
});

SearchCallback.virtual('callback_id').get(function () {
  return this._id;
});

module.exports = function (db) {
  return db.model('SearchCallback', SearchCallback);
};