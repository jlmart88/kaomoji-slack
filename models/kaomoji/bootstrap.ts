import KaomojiModel from 'kaomoji/models/kaomoji';
import kaomojiData from './bootstrap-data.json';
import _ from 'lodash';


export const bootstrapDB = () => {
  const Kaomoji = KaomojiModel;

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