import * as jose from 'jose';
import {
  NextFunction,
  Request,
  Response } from 'express';
import { TextEncoder } from 'util';

import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from '../middleware-interface.js';

import HttpError from '../../errors/http-error.js';

export class AuthenticateMiddleware implements IMiddleware {
  constructor(private readonly secret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }
    const [, token] = authorizationHeader;

    try {
      const {payload} = await jose.jwtVerify(token, new TextEncoder().encode(this.secret));
      req.user = { email: `${payload.email}`, id: `${payload.id}` };
      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.FORBIDDEN,
        'Invalid token',
        'AuthenticateMiddleware')
      );
    }
  }
}
