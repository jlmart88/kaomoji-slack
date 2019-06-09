import { Document, Model } from 'mongoose';
import * as mongoose from 'mongoose';

export interface KaomojiModel extends Document {
  text: string;
  keywords: string;
}

const Kaomoji = new mongoose.Schema({
  text: {
    type: String,
    index: true,
    unique: true
  },
  keywords: {
    type: String,
    index: true,
  }
});

Kaomoji.index({keywords: 'text'}, {default_language: 'english'});

export default mongoose.model('Kaomoji', Kaomoji) as Model<KaomojiModel>;