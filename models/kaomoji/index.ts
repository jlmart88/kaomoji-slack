import mongoose from 'mongoose';

const Kaomoji = new mongoose.Schema({
  text: {
    type: String,
    index: true,
    unique: true
  },
  keywords: String
});

Kaomoji.index({keywords: 'text'}, {default_language: 'english'});

export default function (db: typeof mongoose) {
  return db.model('Kaomoji', Kaomoji);
};