var UserTokenModel = require('./userToken');

module.exports = {
  deleteUserToken: deleteUserToken
}

function deleteUserToken(db, userTokenId) {
  Token = UserTokenModel(db);

  return Token.remove({'_id': userTokenId});
}