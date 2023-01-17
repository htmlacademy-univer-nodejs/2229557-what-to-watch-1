import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {Component} from '../../../models/component.js';
import {ILogger} from '../../../common/logger/logger-interface.js';
import {Controller} from '../../../common/controller/controller.js';
import {IUserService} from '../service/user-service-interface.js';
import {IConfig} from '../../../common/config/config-interface.js';
import {HttpMethod} from '../../../models/http-method.js';
import CreateUserDto from '../dto/user-create-dto.js';
import { fillDTO, createJWT } from '../../../utils/common.js';
import UserResponse from './response/user-response.js';
import HttpError from '../../../common/errors/http-error.js';
import LoginUserDto from '../dto/user-login-dto.js';
import LogoutUserDto from '../dto/user-logout-dto.js';
import {ValidateDtoMiddleware} from '../../../common/middleware/validate-dto-middleware/validate-dto-middleware.js';
import { ValidateObjectIdMiddleware } from '../../../common/middleware/validate-object-id-middleware/validate-object-id-middleware.js';
import { UploadFileMiddleware } from '../../../common/middleware/upload-file-middleware/upload-file-middleware.js';
import LoggedUserResponse from './response/user-logger-response.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IUserService) private readonly userService: IUserService,
    @inject(Component.IConfig) private readonly configService: IConfig,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.create});

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });

    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });

    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar')]
    });
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(
      body, 
      this.configService.get('SALT'));
    
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `Unauthorized`,
        'UserController',
      );
    }

    const token = await createJWT(
      'HS256',
      this.configService.get('SECRET'),
      { ...user }
    );
    this.ok(
      _res, 
      fillDTO(
        LoggedUserResponse, 
        {email: user?.email, token}));
  }

  public async logout(
    {}: Request<Record<string, unknown>, Record<string, unknown>, LogoutUserDto>,
    _res: Response,
  ): Promise<void> {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }
  
  public async authCheck(req: Request, res: Response) {
    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
