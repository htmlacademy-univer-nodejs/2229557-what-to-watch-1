import {Expose} from 'class-transformer';
import {Film} from '../../film.ts';

export default class FilmSearchResponse {
  @Expose()
  public films!: Film[];
}
