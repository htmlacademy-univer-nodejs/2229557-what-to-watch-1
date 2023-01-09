import {Expose} from 'class-transformer';
import {Film} from '../../film';

export default class FilmSearchResponse {
  @Expose()
  public films!: Film[];
}