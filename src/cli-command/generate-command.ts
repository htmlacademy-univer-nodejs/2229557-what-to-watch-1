import MovieGenerator from '../common/movie-generator.js';
import FileWriter from '../common/file-writer.js';
import {MockFilms} from '../types/mock-films.type.js';
import {CliCommandInterface} from './cli-command.interface.js';
import got from 'got';

export default class GenerateCommand implements CliCommandInterface {
    public readonly name = '--generate';
    private mockFilms?: MockFilms;

    public async execute(...parameters:string[]): Promise<void> {
        const count = parseInt(parameters[0], 10);
        const filepath = parameters[1];
        const url = parameters[2];

        console.log(`Start fetch data from ${url}..`)
        try {
            this.mockFilms = await got.get(url).json();
        } catch(e) {
            var error = "";
            
            if (typeof e === "string") {
                error = e;
            } else if (e instanceof Error) {
                error = e.message;
            }

            console.log(`Fetch data from ${url} is failed. Error: ${error}`);
            return
        }
        if (!this.mockFilms) {
            console.log(`Fetched data is empty.`);
            return
        }

        console.log(`Generate movie string...`)
        const movieGenerator = new MovieGenerator(this.mockFilms);
        const fileWriter = new FileWriter(filepath);
        
        console.log(`Write to file...`)
        for (var i = 0; i < count; i++) {
            await fileWriter.write(movieGenerator.generate());
        }

        console.log(`File ${filepath} was created!`);
    }
}