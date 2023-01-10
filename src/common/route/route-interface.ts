import {NextFunction, Request, Response} from 'express';
import {HttpMethod} from '../../models/http-method.js';
import {IMiddleware} from '../middleware/middleware-interface.js';

export interface IRoute {
  path: string;
  method: HttpMethod;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleware[];
}
