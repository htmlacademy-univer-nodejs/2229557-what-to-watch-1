import { CliCommandInterface } from './cli-command.interface.js';
import chalk from 'chalk';

export default class HelpCommand implements CliCommandInterface {
    public readonly name = '--help';
    public async execute(): Promise<void> {
        console.log(`
            ${chalk.underline('Программа для подготовки данных для REST API сервера.')}
            
            ${chalk.underline('Пример:')}
                main.ts --<command> [--arguments]
              
            ${chalk.underline('Команды:')}
                --version:                      # Выводит номер версии
                --help:                         # Печатает этот текст
                --import <path>:                # Импортирует данные из TSV
                --generrtor <n> <path> <url>    # Генерирует произвольное количество тестовых данных
        `);
        
    }
}