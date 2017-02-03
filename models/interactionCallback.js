var mongoose = require('mongoose');

var InteractionCallback = new mongoose.Schema({
    offset: Number,
    search: String
});

InteractionCallback.virtual('callback_id').get(function() {
    return this._id;
});

module.exports = function(db) {
    return db.model('InteractionCallback', InteractionCallback);
};