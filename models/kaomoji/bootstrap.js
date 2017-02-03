var kaomojiData = require('./bootstrap.json');
var KaomojiModel = require('../kaomoji');
var _ = require('lodash')

module.exports = function(db) {
    var Kaomoji = KaomojiModel(db);

    _.each(kaomojiData.kaomojis, kaomoji => {
        try {
            var kaomojiInstance = new Kaomoji(kaomoji);
            kaomojiInstance.save().catch(err => {
                console.log('Couldn\'t create', kaomoji, ', might already be created');
            });
        } catch (err) {
            console.log(err);
        }
    });
};