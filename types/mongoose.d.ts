declare module "mongoose" {
  import Bluebird = require("bluebird");
  type Promise<T> = Bluebird<T>;
}
