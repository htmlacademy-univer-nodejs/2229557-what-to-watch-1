import 'reflect-metadata';
import {Container} from 'inversify';
import {ILogger} from './common/logger/logger-interface.js';
import LoggerService from './common/logger/logger.js';
import {Component} from './models/component.js';
import {IConfig} from './common/config/config-interface.js';
import ConfigService from './common/config/config-service.js';
import { types } from '@typegoose/typegoose';

import { IDatabase } from './common/database-client/databse-interface.js';
import { IUserService } from './entities/user/service/user-service-interface.js';
import { UserEntity, UserModel } from './entities/user/db-user.js';
import { IFilmService } from './entities/film/service/film-service-interface.js';
import { FilmEntity, FilmModel } from './entities/film/db-film.js';
import { IController } from './common/controller/controller-interface.js';
import { IExceptionFilter } from './common/errors/exception-filter/exception-filter-interface.js';
import { ICommentService } from './entities/comment/comments-service-interface.js';
import { CommentEntity, CommentModel } from './entities/comment/db-comment.js';

import Application from './app/application.js';
import CommentService from './entities/comment/comments-service.js';
import CommentController from './entities/comment/controller/comment-controller.js';
import FilmController from './entities/film/controller/film-controller.js';
import ExceptionFilter from './common/errors/exception-filter/exception-filter.js';
import UserController from './entities/user/controller/user-controller.js';
import FilmService from './entities/film/service/film-service.js';
import UserService from './entities/user/service/user-service.js';
import DatabaseClient from './common/database-client/database-client.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ILogger>(Component.ILogger).to(LoggerService).inSingletonScope();
applicationContainer.bind<IConfig>(Component.IConfig).to(ConfigService).inSingletonScope();
applicationContainer.bind<IDatabase>(Component.IDatabase).to(DatabaseClient).inSingletonScope();
applicationContainer.bind<IUserService>(Component.IUserService).to(UserService);
applicationContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
applicationContainer.bind<IFilmService>(Component.IFilmService).to(FilmService).inSingletonScope();
applicationContainer.bind<ICommentService>(Component.ICommentService).to(CommentService).inSingletonScope();
applicationContainer.bind<types.ModelType<FilmEntity>>(Component.FilmModel).toConstantValue(FilmModel);
applicationContainer.bind<IController>(Component.FilmController).to(FilmController).inSingletonScope();
applicationContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
applicationContainer.bind<IController>(Component.CommentController).to(CommentController).inSingletonScope();
applicationContainer.bind<IExceptionFilter>(Component.IExceptionFilter).to(ExceptionFilter).inSingletonScope();
applicationContainer.bind<IController>(Component.UserController).to(UserController).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);
await application.init();
