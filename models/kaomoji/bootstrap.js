var kaomojiData = require('./bootstrap.json');
var KaomojiModel = require('../kaomoji');
var _ = require('lodash')

module.exports = function(db) {
    var Kaomoji = KaomojiModel(db);

    _.each(kaomojiData.kaomojis, kaomoji => {
        var kaomojiInstance = new Kaomoji(kaomoji);
        kaomojiInstance.save();
    });
};