import 'reflect-metadata';
import {types} from '@typegoose/typegoose';
import Application from './app/application.js';
import LoggerService from './common/logger/logger.service.js';
import ConfigService from './common/config/config.service.js';
import {Container} from 'inversify';
import {COMPONENT} from './types/component.type.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import {ConfigInterface} from './common/config/config.interface.js';
import MongoDbClient from './common/db-client/mongo-db-client';
import {DatabaseInterface} from './common/db-client/db-client.interface.js';
import UserService from './modules/user/user-service.js';
import {UserServiceInterface} from './modules/user/user-service.interface.js';
import {UserEntity, UserModel} from './modules/user/user.entity.js';
import {MovieServiceInterface} from './modules/movie/movie-service.interface.js';
import MovieService from './modules/movie/movie-service.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(COMPONENT.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(COMPONENT.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(COMPONENT.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(COMPONENT.DatabaseInterface).to(DatabaseService).inSingletonScope();
applicationContainer.bind<UserServiceInterface>(COMPONENT.UserServiceInterface).to(UserService);
applicationContainer.bind<types.ModelType<UserEntity>>(COMPONENT.UserModel).toConstantValue(UserModel);
applicationContainer.bind<MovieServiceInterface>(COMPONENT.UserServiceInterface).to(MovieService);

const application = applicationContainer.get<Application>(COMPONENT.Application);
await application.init();