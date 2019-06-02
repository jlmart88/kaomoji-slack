declare namespace Express {
  export interface Request {
    staticRoot: string;
    user: string;
    token: any;
    payload: any;
  }
}
