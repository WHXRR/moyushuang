import { JwtUserData } from '../guard/auth.guard';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}
