var mongoose = require('mongoose');

var ListCallback = new mongoose.Schema({
  offset: Number,
  limit: Number
});

ListCallback.virtual('callback_id').get(function () {
  return this._id;
});

module.exports = function (db) {
  return db.model('ListCallback', ListCallback);
};