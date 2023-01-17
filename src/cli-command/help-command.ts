
import chalk from 'chalk';

import { ILogger } from '../common/logger/logger-interface.js';
import {ICliCommand} from './cli-command.interface.js';

import LoggerService from '../common/logger/logger.js';

export default class HelpCommand implements ICliCommand {
  public readonly name = '--help';
  private readonly logger: ILogger;

  constructor() {
    this.logger = new LoggerService();
  }

  public async execute(): Promise<void> {
    this.logger.info(`
            ${chalk.underline('Программа для подготовки данных для REST API сервера.')}

            ${chalk.underline('Пример:')}
                main.ts --<command> [--arguments]

            ${chalk.underline('Команды:')}
                --version:                      # Выводит номер версии
                --help:                         # Печатает этот текст
                --import <path>:                # Импортирует данные из TSV
                --generate <n> <path> <url>    # Генерирует произвольное количество тестовых данных
        `);

  }
}
