var mongoose = require('mongoose');

var UserToken = new mongoose.Schema({
    user: {
        name: String,
        id: {
            type: String,
            unique: true,
            index: true
        }
    },
    team: {
        id: String
    },
    access_token: String,
    scope: String
});

module.exports = function(db) {
    return db.model('UserToken', UserToken);
};