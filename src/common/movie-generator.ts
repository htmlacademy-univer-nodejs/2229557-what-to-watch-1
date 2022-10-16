import {MockFilms} from '../types/mock-films.type.js';
import {Genre} from '../types/genre.enum.js';

export default class MovieGenerator {
    constructor(private readonly mockFilms: MockFilms) {}

    public generate(): string {
        const name = this.getRandomItem<string>(this.mockFilms.names);
        const description = this.getRandomItem<string>(this.mockFilms.descriptions);
        const postDate = new Date();
        const genre = <Genre>this.getRandomItem(this.mockFilms.genres);
        const releaseYear = this.getRandomItem<number>(this.mockFilms.releaseYears);
        const rating = this.getRandomItem<number>(this.mockFilms.ratings);;
        const movie = this.getRandomItem<string>(this.mockFilms.movies);
        const actors = this.getRandomItems<string>(this.mockFilms.actors).join(';');
        const producer = this.getRandomItem<string>(this.mockFilms.producers);
        const movieDuration = this.getRandomItem(this.mockFilms.movieDurations);
        const userName = this.getRandomItem<string>(this.mockFilms.userNames);
        const userEmail = this.getRandomItem<string>(this.mockFilms.userEmails);
        const avatarPath = this.getRandomItem<string>(this.mockFilms.avatarPaths);
        const poster = this.getRandomItem<string>(this.mockFilms.posterPaths);
        const backgroundImage = this.getRandomItem<string>(this.mockFilms.backgroundImages);
        const backgroundColor = this.getRandomItem<string>(this.mockFilms.backgroundColors);
    
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
    
    private getRandomNumber(min: number, max: number) {
        return Number(((Math.random() * (max - min)) + min).toFixed(0));
    }
    private getRandomItems<T>(items: T[]): T[] {
        const randomPosition = this.getRandomNumber(0, items.length - 1);
        return items.slice(randomPosition, randomPosition + this.getRandomNumber(randomPosition, items.length));
    };
    
    private getRandomItem<T>(items: T[]): T {
        return items[this.getRandomNumber(0, items.length - 1)];
    }
}