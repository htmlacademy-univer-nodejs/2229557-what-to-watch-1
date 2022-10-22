import pino, {Logger} from 'pino';
import {injectable} from 'inversify';

@injectable()
export default class LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = pino();
    this.logger.info('Logger is created.');
  }

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.logger.error(message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, ...args);
  }
}