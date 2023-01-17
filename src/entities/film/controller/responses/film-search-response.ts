import { Expose, Type } from 'class-transformer';

import { Genre } from '../../../../models/genre.js';

import UserResponse from '../../../user/controller/response/user-response.js';

export default class FilmSearchItem {
  @Expose()
  public title!: string;

  @Expose()
  public publicationDate!: number;

  @Expose()
  public genre!: Genre;

  @Expose()
  public previewLink!: string;

  @Expose()
  @Type(() => UserResponse)
  public user!: UserResponse;

  @Expose()
  public posterLink!: string;

  @Expose()
  public commentsCount!: number;
}
