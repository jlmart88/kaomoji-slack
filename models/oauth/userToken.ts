import * as mongoose from "mongoose";

interface UserTokenModel {
  team_id: string;
  user_id: string;
  team_name: string;
  access_token: string;
  scope: string;
  bot: {
    bot_user_id: string;
    bot_access_token: string;
  };
}

const UserToken = new mongoose.Schema<UserTokenModel>({
  team_id: String,
  user_id: String,
  team_name: String,
  access_token: String,
  scope: String,
  bot: {
    bot_user_id: String,
    bot_access_token: String,
  },
});

UserToken.index({ user_id: 1, team_id: 1 }, { unique: true });

export default mongoose.models.UserToken ||
  mongoose.model("UserToken", UserToken);
