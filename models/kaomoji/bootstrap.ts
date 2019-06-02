import * as mongoose from 'mongoose';
const kaomojiData = require('./bootstrap.json');
import KaomojiModel from 'kaomoji/models//kaomoji';
import _ from 'lodash';

export default function (db: typeof mongoose) {
  var Kaomoji = KaomojiModel(db);

  _.each(kaomojiData.kaomojis, kaomoji => {
    try {
      Kaomoji.findOneAndUpdate({text: kaomoji.text}, kaomoji, {upsert: true, new: true})
        .exec()
        .catch((err: any) => {
          console.error('Couldn\'t upsert', kaomoji, '.');
        });
    } catch (err) {
      console.log(err);
    }
  });
};