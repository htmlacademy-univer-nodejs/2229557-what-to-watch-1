import TSVFileReader from '../common/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';

export default class ImportCommand implements CliCommandInterface {
    public readonly name = '--import';
    public async execute(filename: string): Promise<void> {
        const fileReader = new TSVFileReader(filename.trim());
        fileReader.on('parsedMovie', (parsedMovie) => console.log(parsedMovie));
        try {
            fileReader.read();
        } catch (err) {

            if (!(err instanceof Error)) {
                throw err;
            }

            console.log(`Не удалось импортировать данные. ${err.message}`);
        }
    }
}