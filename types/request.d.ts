import * as mongoose from 'mongoose';

declare namespace Express {
  export interface Request {
    staticRoot: string;
    db: typeof mongoose;
    user: string;
    token: any;
    payload: any;
  }
}
