import { User } from './user.js';
import { Genre } from './genre.js';

export type Film = {
  title: string;
  description: string;
  publicationDate: Date;
  genre: Genre;
  releaseYear: number;
  rating: number;
  previewLink: string;
  link: string;
  actors: string[];
  producer: string;
  durationInMinutes: number;
  user: User;
  posterLink: string;
  backgroundImageLink: string;
  backgroundColor: string;
}
