import * as mongoose from 'mongoose';

import UserTokenModel from './userToken';

export default {
  deleteUserToken: deleteUserToken
}

function deleteUserToken(db: typeof mongoose, userTokenId: string) {
  const Token = UserTokenModel(db);

  return Token.remove({'_id': userTokenId});
}