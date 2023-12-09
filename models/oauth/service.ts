import _ from "lodash";
import UserTokenModel from "./userToken";
import clientPromise from "@/lib/mongodb";

export class NoUserTokenError extends Error {}

export async function deleteUserToken(userTokenId: string) {
  await clientPromise;
  return UserTokenModel.deleteOne({ _id: userTokenId }).exec();
}

export async function getUserToken(user_id: string) {
  await clientPromise;
  const token = await UserTokenModel.findOne({ user_id }).exec();
  if (_.isNil(token)) {
    throw new NoUserTokenError();
  }
  return token;
}
