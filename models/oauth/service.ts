import UserTokenModel from "./userToken";

export default {
  deleteUserToken: deleteUserToken,
};

function deleteUserToken(userTokenId: string) {
  return UserTokenModel.deleteOne({ _id: userTokenId });
}
