import { Document, Model } from 'mongoose';
import * as mongoose from 'mongoose';

interface ShortcutModel extends Document {
  user_id: string;
  kaomoji_text: string;
}

const Shortcut = new mongoose.Schema({
  user_id: String,
  kaomoji_text: String
});

Shortcut.index({user_id: 1, kaomoji_text: 1}, {unique: true});

export default mongoose.model('Shortcut', Shortcut) as Model<ShortcutModel>;
