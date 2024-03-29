import {
  NextFunction,
  Request,
  Response} from 'express';
import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from '../middleware-interface.js';
import HttpError from '../../errors/http-error.js';

export class PrivateRouteMiddleware implements IMiddleware {
  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    }
    return next();
  }
}
