import {LoggerInterface} from '../common/logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {COMPONENT} from '../types/component.type.js';
import { ConfigInterface } from '../common/config/config.interface.js';

@injectable()
export default class Application {
  constructor(@inject(COMPONENT.LoggerInterface) private logger: LoggerInterface,
              @inject(COMPONENT.ConfigInterface) private config: ConfigInterface) {}

  async init() {
    const port = this.config.get("PORT");
    const db_host = this.config.get("DB_HOST");

    this.logger.info(`Application is initialized. Port: ${port}. DB_HOST: ${db_host}.`);
  }
}