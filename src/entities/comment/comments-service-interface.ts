import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {CommentEntity} from './db-comment.js';

import CreateCommentDto from './dto/comment-create-dto.js';

export interface ICommentService {
  findByFilmId(filmId: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  deleteByFilmId(filmId: string): Promise<void | null>
}
