import { Genre } from "./genre.enum.js";
import { User } from "./user.type.js";

export type Movie = {
    name: string;
    description: string;
    postDate: Date;
    genre: Genre;
    releaseYear: number;
    rating: number;
    movie: string;
    actors: string[];
    producer: string;
    movieDuration: number;
    commentsCount: number;
    user: User;
    poster: string;
    backgroundImage: string;
    backgroundColor: string;
}