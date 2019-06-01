var kaomojiData = require('./bootstrap.json');
var KaomojiModel = require('../kaomoji');
var _ = require('lodash')

module.exports = function (db) {
  var Kaomoji = KaomojiModel(db);

  _.each(kaomojiData.kaomojis, kaomoji => {
    try {
      Kaomoji.findOneAndUpdate({text: kaomoji.text}, kaomoji, {upsert: true, new: true})
        .exec()
        .catch(err => {
          console.error('Couldn\'t upsert', kaomoji, '.');
        });
    } catch (err) {
      console.log(err);
    }
  });
};