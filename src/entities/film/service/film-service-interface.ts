import { DocumentType } from '@typegoose/typegoose';

import { FilmEntity } from '../db-film.js';
import { IDocumentExists } from '../../../common/middleware/document-exists-middleware/document-exists-interface.js';
import { Genre } from '../../../models/genre.js';

import CreateFilmDto from '../dto/film-create-dto.js';
import UpdateFilmDto from '../dto/film-update-dto.js';

export interface IFilmService extends IDocumentExists {
  create(dto: CreateFilmDto): Promise<DocumentType<FilmEntity>>;
  findById(filmId: string): Promise<DocumentType<FilmEntity> | null>;
  findByName(filmName: string): Promise<DocumentType<FilmEntity> | null>;
  find(): Promise<DocumentType<FilmEntity>[]>;
  update(dto: UpdateFilmDto): Promise<DocumentType<FilmEntity> | null>;
  deleteById(filmId: string): Promise<void | null>;
  findByLimit(limit: number): Promise<DocumentType<FilmEntity>[]>;
  findByGenre(genre: Genre, limit?: number): Promise<DocumentType<FilmEntity>[]>;
  findPromo(): Promise<DocumentType<FilmEntity> | null>;
  incCommentsCount(filmId: string): Promise<void | null>;
  updateFilmRating(filmId: string, newRating: number): Promise<void | null>;
}
