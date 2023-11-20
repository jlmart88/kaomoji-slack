import * as mongoose from "mongoose";

export interface KaomojiModel {
  _id: mongoose.ObjectId;
  text: string;
  keywords: string;
}

const Kaomoji = new mongoose.Schema<KaomojiModel>({
  text: {
    type: String,
    index: true,
    unique: true,
  },
  keywords: {
    type: String,
    index: true,
  },
});

Kaomoji.index({ keywords: "text" }, { default_language: "english" });

const registerModel = () => mongoose.model<KaomojiModel>("Kaomoji", Kaomoji);

export default (mongoose.models.Kaomoji as ReturnType<typeof registerModel>) ||
  registerModel();
