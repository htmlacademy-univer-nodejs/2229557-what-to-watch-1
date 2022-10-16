import 'reflect-metadata';
import Application from './app/application.js';
import LoggerService from './common/logger/logger.service.js';
import {Container} from 'inversify';
import {COMPONENT} from './types/component.type.js';
import {LoggerInterface} from './common/logger/logger.interface.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(COMPONENT.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(COMPONENT.LoggerInterface).to(LoggerService).inSingletonScope();

const application = applicationContainer.get<Application>(COMPONENT.Application);
await application.init();