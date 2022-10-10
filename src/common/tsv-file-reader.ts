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
        var lineRead = '';
        var endLinePosition = -1;

        for await (const chunk of stream) {
            try {
                lineRead += chunk.toString();
            } catch { }
        }

        while ((endLinePosition = lineRead.indexOf('\n')) >= 0) {
            const row = lineRead.slice(0, endLinePosition + 1);
            lineRead = lineRead.slice(++endLinePosition);
            this.emit('parsedMovie', this.ToMovie(row));
        }
    }

    private ToMovie(str: string): Movie | undefined{
        if (!str) return;
        var params = str.split('\\t');

        return {
            name: params[0],
            description: params[1],
            postDate: new Date(params[2]),
            genre: <Genre>params[3],
            releaseYear: Number(params[4]),
            rating: Number(params[5]),
            movie: params[6],
            actors: String(params[7]).split(';'),
            producer: params[8],
            movieDuration: Number(params[9]),
            commentsCount: Number(params[10]),
            user: {name: params[11], email: params[12], avatarPath: params[13], password: params[14]},
            poster: params[15],
            backgroundImage: params[16],
            backgroundColor: params[17]
            };
    }
}