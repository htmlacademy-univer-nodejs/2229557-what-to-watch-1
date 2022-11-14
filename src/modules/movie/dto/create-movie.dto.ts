import {Genre} from '../../../types/genre.enum.js';

export default class CreateMovieDto {
    public name!: string;
    public description!: string;
    public postDate!: Date;
    public genre!: Genre;
    public releaseYear!: number;
    public rating!: number;
    public movie!: string;
    public actors!: string[];
    public producer!: string;
    public movieDuration!: number;
    public commentsCount!: number;
    public userId!: string;
    public poster!: string;
    public backgroundImage!: string;
    public backgroundColor!: string;
}