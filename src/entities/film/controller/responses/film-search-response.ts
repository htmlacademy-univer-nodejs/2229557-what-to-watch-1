import {Expose} from 'class-transformer';
import {Film} from '../../film.js';

export default class FilmSearchResponse {
  @Expose()
  public films!: Film[];
}
