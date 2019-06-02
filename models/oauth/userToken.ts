import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';

interface UserTokenModel extends Document {
  team_id: string;
  user_id: string;
  team_name: string;
  access_token: string;
  scope: string;
  bot: {
    bot_user_id: string;
    bot_access_token: string;
  }
}

const UserToken = new mongoose.Schema({
  team_id: String,
  user_id: String,
  team_name: String,
  access_token: String,
  scope: String,
  bot: {
    bot_user_id: String,
    bot_access_token: String
  }
});

UserToken.index({ user_id: 1, team_id: 1 }, { unique: true });

export default mongoose.model('UserToken', UserToken) as Model<UserTokenModel>;
