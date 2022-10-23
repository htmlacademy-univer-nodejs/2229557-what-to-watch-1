import TSVFileReader from '../common/tsv-file-reader.js';
import { CliCommandInterface } from './cli-command.interface.js';
import {UserServiceInterface} from '../modules/user/user-service.interface.js';
import {DatabaseInterface} from '../common/db-client/db-client.interface.js';
import {LoggerInterface} from '../common/logger/logger.interface.js';
import {MovieServiceInterface} from '../modules/movie/movie-service.interface.js';
import {UserModel} from '../modules/user/user.entity.js';
import UserService from '../modules/user/user-service.js';
import MovieService from '../modules/movie/movie-service.js';
import {MovieModel} from '../modules/movie/movie.entity.js';
import MongoDBService from '../common/db-client/mongo-db-client.js';
import {Movie} from '../types/movie.type.js';
import {inject} from 'inversify';
import {COMPONENT} from '../types/component.type.js';

export default class ImportCommand implements CliCommandInterface {
    public readonly name = '--import';
    private userService!: UserServiceInterface;
    private movieService!: MovieServiceInterface;
    private databaseService!: DatabaseInterface;
    private salt!: string;

    constructor(@inject(COMPONENT.LoggerInterface) private logger: LoggerInterface) {
        this.onParsedMovie = this.onParsedMovie.bind(this);
        this.onComplete = this.onComplete.bind(this);
    
        this.logger = logger;
        this.movieService = new MovieService(this.logger, MovieModel);
        this.userService = new UserService(this.logger, UserModel);
        this.databaseService = new MongoDBService(this.logger);
    }

    public async execute(filename: string, db_user: string, db_password: string, db_host: string, db_port: string, db_name: string, salt: string): Promise<void> {
        const uri = `mongodb://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?authSource=admin`;
        this.salt = salt;
        
        await this.databaseService.connect(uri)

        const fileReader = new TSVFileReader(filename.trim());
        fileReader.on('parsedMovie', this.onParsedMovie);
        fileReader.on('complete', this.onComplete);
    
        
        try {
            fileReader.read();
        } catch (err) {

            if (!(err instanceof Error)) {
                throw err;
            }

            console.log(`Не удалось импортировать данные. ${err.message}`);
        }
    }

    private async onParsedMovie(movie: Movie, resolve: () => void) {
        console.log(movie);
        const user = await this.userService.findOrCreate({
            ...movie.user
        }, this.salt);

        await this.movieService.create({
            ...movie,
            userId: user.id,
        });
        resolve();
    }

    private onComplete(count: number) {
        this.databaseService.disconnect();
    }
}