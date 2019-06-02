import UserTokenModel from './userToken';

export default {
  deleteUserToken: deleteUserToken
}

function deleteUserToken(userTokenId: string) {
  return UserTokenModel.remove({'_id': userTokenId});
}
