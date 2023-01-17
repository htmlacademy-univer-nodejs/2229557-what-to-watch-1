import {Genre} from '../../../models/genre.js';
import CreateFilmDto from './film-create-dto.js';

export default class UpdateFilmDto extends CreateFilmDto{
  public id!: string;
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public genre!: Genre;
  public releaseYear!: number;
  public rating!: number;
  public previewLink!: string;
  public link!: string;
  public actors!: string[];
  public producer!: string;
  public durationInMinutes!: number;
  public userId!: string;
  public posterLink!: string;
  public backgroundImageLink!: string;
  public backgroundColor!: string;
}
