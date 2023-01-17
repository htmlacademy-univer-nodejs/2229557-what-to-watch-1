import { Expose } from 'class-transformer';

import { Film } from '../../../../models/film.js';

export default class FilmsSearchResponse {
  @Expose()
  public films!: Film[];
}
