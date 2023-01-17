import chalk from 'chalk';
import {readFileSync} from 'fs';

import { ICliCommand} from './cli-command.interface.js';
import { ILogger } from '../common/logger/logger-interface.js';

import LoggerService from '../common/logger/logger.js';

export default class VersionCommand implements ICliCommand {
  public readonly name = '--version';
  private readonly logger: ILogger;

  constructor() {
    this.logger = new LoggerService();
  }

  private getVersion(): string {
    const content = JSON.parse(readFileSync('./package.json','utf-8'));
    return content.version;
  }

  public async execute() {
    const version = this.getVersion();
    this.logger.info(chalk.greenBright(chalk.bgGrey(version)));
  }
}
