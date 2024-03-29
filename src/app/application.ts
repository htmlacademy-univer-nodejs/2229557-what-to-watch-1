import 'reflect-metadata';
import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import {ILogger} from '../common/logger/logger-interface.js';
import {IConfig} from '../common/config/config-interface.js';
import {Component} from '../models/component.js';
import {IDatabase} from '../common/database-client/databse-interface.js';
import {getURI} from '../utils/db-helper.js';
import {IController} from '../common/controller/controller-interface.js';
import {IExceptionFilter} from '../common/errors/exception-filter/exception-filter-interface.js';
import {AuthenticateMiddleware} from '../common/middleware/auth-middleware/auth-middleware.js';


@injectable()
export default class Application {

  private expressApp: Express;

  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.IConfig) private config: IConfig,
    @inject(Component.IDatabase) private databaseClient: IDatabase,
    @inject(Component.FilmController) private filmController: IController,
    @inject(Component.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(Component.UserController) private userController: IController,
    @inject(Component.CommentController) private commentController: IController,
  ){
    this.expressApp = express();
  }

  public async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    const port = this.config.get('PORT');
    this.expressApp.listen(port);
    this.logger.info(`Server started on port ${port}`);
  }

  public initRoutes() {
    this.expressApp.use('/films', this.filmController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('SECRET'));
    this.expressApp.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
    this.expressApp.use(cors());
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }
}
