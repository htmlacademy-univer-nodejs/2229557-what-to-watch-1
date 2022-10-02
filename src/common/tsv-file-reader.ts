import {readFileSync} from 'fs'
import { Genre } from '../types/genre.enum.js';
import { Movie } from '../types/movie.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
    private rawData = '';

    constructor(public filename: string) { }

    public read(): void {
        this.rawData = readFileSync(this.filename, { encoding: 'utf8'});
    }

    public toArray(): Movie[] {
        if (!this.rawData){
            return [];
        }

        return this.rawData
            .split('\n')
            .filter((row) => row.trim() !== '')
            .map((line) => line.split('\\t'))
            .map(([name, description, postDate, genre, releaseYear, rating, movie, actors, producer, movieDuration, commentsCount, userName, userEmail, userAvatarPath, userPassword, poster, backgroundImage, backgroundColor]) => ({
                name,
                description,
                postDate: new Date(postDate),
                genre: Genre[genre as 'Comedy' | 'Crime' | 'Documentary' | 'Drama' | 'Horror' | 'Family' | 'Romance' | 'Scifi' | 'Thriller'],
                releaseYear: +releaseYear,
                rating: +rating,
                movie,
                actors: String(actors).split(';'),
                producer,
                movieDuration: +movieDuration,
                commentsCount: +commentsCount,
                user: {name: userName, email: userEmail, avatarPath: userAvatarPath, password: userPassword},
                poster,
                backgroundImage,
                backgroundColor
            }));
    }
}