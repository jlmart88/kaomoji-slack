var mongoose = require('mongoose');

var AppToken = new mongoose.Schema({
    team_id: {
        type: String,
        unique: true,
        index: true
    },
    user_id: String,
    team_name: String,
    access_token: String,
    scope: String,
    bot: {
        bot_user_id: String,
        bot_access_token: String
    }
});

module.exports = function(db) {
    return db.model('AppToken', AppToken);
};