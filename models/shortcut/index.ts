import * as mongoose from "mongoose";

export interface ShortcutModel {
  _id: mongoose.ObjectId;
  user_id: string;
  kaomoji_text: string;
}

const Shortcut = new mongoose.Schema<ShortcutModel>({
  user_id: String,
  kaomoji_text: String,
});

Shortcut.index({ user_id: 1, kaomoji_text: 1 }, { unique: true });

const registerModel = () => mongoose.model<ShortcutModel>("Shortcut", Shortcut);

export default (mongoose.models.Shortcut as ReturnType<typeof registerModel>) ||
  registerModel();
