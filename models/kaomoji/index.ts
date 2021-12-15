import * as mongoose from 'mongoose';

export interface KaomojiModel {
  _id: mongoose.ObjectId;
  text: string;
  keywords: string;
}

const Kaomoji = new mongoose.Schema<KaomojiModel>({
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

export default mongoose.model<KaomojiModel>('Kaomoji', Kaomoji);
