import {MockFilms} from '../types/mock-films.type.js';
import {Genre} from '../types/genre.enum.js';

export default class MovieGenerator {
    constructor(private readonly mockData: MockFilms) {}

    public generate(): string {
        const name = this.GetRandomItem<string>(this.mockData.names);
        const description = this.GetRandomItem<string>(this.mockData.descriptions);
        const postDate = new Date();
        const genre = <Genre>this.GetRandomItem(this.mockData.genres);
        const releaseYear = this.GetRandomItem<number>(this.mockData.releaseYears);
        const rating = this.GetRandomItem<number>(this.mockData.ratings);;
        const movie = this.GetRandomItem<string>(this.mockData.movies);
        const actors = this.GetRandomItems<string>(this.mockData.actors).join(';');
        const producer = this.GetRandomItem<string>(this.mockData.producers);
        const movieDuration = this.GetRandomItem(this.mockData.movieDurations);
        const userName = this.GetRandomItem<string>(this.mockData.userNames);
        const userEmail = this.GetRandomItem<string>(this.mockData.userEmails);
        const avatarPath = this.GetRandomItem<string>(this.mockData.avatarPaths);
        const poster = this.GetRandomItem<string>(this.mockData.posterPaths);
        const backgroundImage = this.GetRandomItem<string>(this.mockData.backgroundImages);
        const backgroundColor = this.GetRandomItem<string>(this.mockData.backgroundColors);
    
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