import { DocumentType } from '@typegoose/typegoose';
import CreateUserDto from '../dto/user-create-dto.js';
import {UserEntity} from '../db-user.js';
import LoginUserDto from '../dto/user-login-dto.js';

export interface IUserService {
  create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>>;
  verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
}
