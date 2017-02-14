var mongoose = require('mongoose');

var UserToken = new mongoose.Schema({
    team_id: String,
    user_id: String,
    team_name: String,
    access_token: String,
    scope: String,
    bot: {
        bot_user_id: String,
        bot_access_token: String
    }
});

UserToken.index({user_id: 1, team_id: 1}, {unique: true});

module.exports = function(db) {
    return db.model('UserToken', UserToken);
};