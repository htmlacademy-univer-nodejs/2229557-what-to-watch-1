import {MockFilms} from '../types/mock-films.type.js';
import {Genre} from '../types/genre.enum.js';

export default class MovieGenerator {
    constructor(private readonly mockFilms: MockFilms) {}

    public generate(): string {
        const name = this.GetRandomItem<string>(this.mockFilms.names);
        const description = this.GetRandomItem<string>(this.mockFilms.descriptions);
        const postDate = new Date();
        const genre = <Genre>this.GetRandomItem(this.mockFilms.genres);
        const releaseYear = this.GetRandomItem<number>(this.mockFilms.releaseYears);
        const rating = this.GetRandomItem<number>(this.mockFilms.ratings);;
        const movie = this.GetRandomItem<string>(this.mockFilms.movies);
        const actors = this.GetRandomItems<string>(this.mockFilms.actors).join(';');
        const producer = this.GetRandomItem<string>(this.mockFilms.producers);
        const movieDuration = this.GetRandomItem(this.mockFilms.movieDurations);
        const userName = this.GetRandomItem<string>(this.mockFilms.userNames);
        const userEmail = this.GetRandomItem<string>(this.mockFilms.userEmails);
        const avatarPath = this.GetRandomItem<string>(this.mockFilms.avatarPaths);
        const poster = this.GetRandomItem<string>(this.mockFilms.posterPaths);
        const backgroundImage = this.GetRandomItem<string>(this.mockFilms.backgroundImages);
        const backgroundColor = this.GetRandomItem<string>(this.mockFilms.backgroundColors);
    
        return [
            name,
            description,
            postDate,
            genre,
            releaseYear,
            rating,
            movie,
            actors,
            producer,
            movieDuration,
            userName,
            userEmail,
            0,
            avatarPath,
            "",
            poster,
            backgroundImage,
            backgroundColor,
        ].join('\t');
    }
    
    private GetRandomNumber(min: number, max: number) {
        return Number(((Math.random() * (max - min)) + min).toFixed(0));
    }
    private GetRandomItems<T>(items: T[]): T[] {
        const randomPosition = this.GetRandomNumber(0, items.length - 1);
        return items.slice(randomPosition, randomPosition + this.GetRandomNumber(randomPosition, items.length));
    };
    
    private GetRandomItem<T>(items: T[]): T {
        return items[this.GetRandomNumber(0, items.length - 1)];
    }
}