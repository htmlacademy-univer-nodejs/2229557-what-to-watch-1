import {LoggerInterface} from '../common/logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {COMPONENT} from '../types/component.type.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import {DatabaseInterface} from '../common/db-client/db-client.interface.js';

@injectable()
export default class Application {
  constructor(@inject(COMPONENT.LoggerInterface) private logger: LoggerInterface,
              @inject(COMPONENT.ConfigInterface) private config: ConfigInterface,
              @inject(COMPONENT.DatabaseInterface) private dbClient: DatabaseInterface) {}

  async init() {
    const port = this.config.get("PORT");

    await this.dbClient.connect(this.getDbUri());
    this.logger.info(`Application is initialized. Port: ${port}.`);
  }

  private getDbUri(): string {
    const db_user = this.config.get('DB_USER');
    const db_password = this.config.get('DB_PASSWORD');
    const db_host = this.config.get('DB_HOST');
    const db_port = this.config.get('DB_PORT');
    const db_name = this.config.get('DB_NAME');
    return `mongodb://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?authSource=admin`;
  }
}