import {createReadStream} from 'fs';
import { Genre } from '../types/genre.enum.js';
import { Movie } from '../types/movie.type.js';
import { FileReaderInterface } from './file-reader.interface.js';
import EventEmitter from 'events';

export default class TSVFileReader extends EventEmitter implements FileReaderInterface {
    constructor(public filename: string) { 
        super();
    }

    public async read(): Promise<void> {
        const stream = createReadStream(this.filename, {encoding: 'utf-8'});
        let lineRead = '';
        let endLinePosition = -1;

        for await (const chunk of stream) {
            try {
                lineRead += chunk.toString();
            } catch { }
        }

        while ((endLinePosition = lineRead.indexOf('\n')) >= 0) {
            const row = lineRead.slice(0, endLinePosition + 1);
            lineRead = lineRead.slice(++endLinePosition);
            this.emit('parsedMovie', this.toMovie(row));
        }
    }

    private toMovie(str: string): Movie | undefined{
        if (!str) {
            return;
        }
            
        const [name, description, postDate, genre,
            releaseYear, rating, movie, 
            actors, producer, movieDuration, commentsCount,
            userName, userEmail, avatarPath, userPassword,
            poster, backgroundImage, backgroundColor] = str.split('\\t');

        return {
            name,
            description,
            postDate: new Date(postDate),
            genre: <Genre>genre,
            releaseYear: Number(releaseYear),
            rating: Number(rating),
            movie,
            actors: String(actors).split(';'),
            producer: producer,
            movieDuration: Number(movieDuration),
            commentsCount: Number(commentsCount),
            user: {name: userName, email: userEmail, avatarPath: avatarPath, password: userPassword},
            poster,
            backgroundImage,
            backgroundColor
            };
    }
}