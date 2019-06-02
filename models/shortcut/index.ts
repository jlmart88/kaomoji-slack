import mongoose from 'mongoose';

var Shortcut = new mongoose.Schema({
  user_id: String,
  kaomoji_text: String
});

Shortcut.index({user_id: 1, kaomoji_text: 1}, {unique: true});

export default function (db: typeof mongoose) {
  return db.model('Shortcut', Shortcut);
};