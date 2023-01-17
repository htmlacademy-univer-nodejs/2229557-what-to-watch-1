import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { Component } from '../../../models/component.js';
import { ILogger } from '../../../common/logger/logger-interface.js';
import { Controller } from '../../../common/controller/controller.js';
import { IUserService } from '../service/user-service-interface.js';
import { IConfig } from '../../../common/config/config-interface.js';
import { HttpMethod } from '../../../models/http-method.js';
import { fillDTO, createJWT } from '../../../utils/common.js';
import { ValidateDtoMiddleware } from '../../../common/middleware/validate-dto-middleware/validate-dto-middleware.js';
import { UploadFileMiddleware } from '../../../common/middleware/upload-file-middleware/upload-file-middleware.js';

import LoggedUserResponse from './response/user-logger-response.js';
import CreateUserDto from '../dto/user-create-dto.js';
import UserResponse from './response/user-response.js';
import HttpError from '../../../common/errors/http-error.js';
import LoginUserDto from '../dto/user-login-dto.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IUserService) private readonly userService: IUserService,
    @inject(Component.IConfig) private readonly configService: IConfig,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.get
    });

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
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new UploadFileMiddleware(this.configService
          .get('UPLOAD_DIRECTORY'), 'avatar')]
    });
  }

  async get({ user }: Request, res: Response): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    const existsUser = await this.userService.findByEmail(
      user.email);
    this.ok(res, fillDTO(LoggedUserResponse, existsUser));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);
    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'User is exists',
        'UserController'
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT'));
    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(UserResponse, result)
    );
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    _res: Response): Promise<void> {
    const user = await this.userService.verifyUser(
      body,
      this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController',
      );
    }

    const token = await createJWT(
      'HS256',
      this.configService.get('SECRET'),
      { id: user.id, email: user.email }
    );
    this.ok(
      _res,
      fillDTO(
        LoggedUserResponse,
        {email: user?.email, token}));
  }

  async uploadAvatar({ params, user, file }: Request, res: Response) {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'UNAUTHORIZED',
        'UsersController'
      );
    }
    const existsUser = await this.userService.findByEmail(user.email);
    if (!existsUser) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        'User not found',
        'UsersController'
      );
    }
    if (file) {
      await this.userService.setUserAvatarPath(params.userId, file.filename);
      this.created(res, {
        avatarPath: file.filename
      });
    }
  }
}
