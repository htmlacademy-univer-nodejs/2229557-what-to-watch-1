import { CliCommandInterface } from './cli-command.interface.js';

export default class HelpCommand implements CliCommandInterface {
    public readonly name = '--help';
    public async execute(): Promise<void> {
        console.log(`
            Программа для подготовки данных для REST API сервера.
            
            Пример:
                main.ts --<command> [--arguments]
                
            Команды:
                --version:                      # Выводит номер версии
                --help:                         # Печатает этот текст
                --import <path>:                # Импортирует данные из TSV
                --generrtor <n> <path> <url>    # Генерирует произвольное количество тестовых данных
        `);
        
    }
}