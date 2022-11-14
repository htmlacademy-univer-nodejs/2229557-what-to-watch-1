import {User} from '../../types/user.type.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import crypto from 'crypto';
import CreateUserDto from './dto/create-user.dto.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: CreateUserDto) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatarPath = data.avatarPath;
  }

  @prop({ required: true, minlength: [1], maxlength: [15] })
  public name!: string;

  @prop({ unique: true, required: true, match: [/^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Email is incorrect'] })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ required: false, match: [/.*\.(?:jpg|png)/] })
  public avatarPath?: string;

  public setPassword(password: string, salt: string) {
    if (password.length < 6 || password.length > 12) {
      throw new Error('Password must be from 6 to 12 characters.');
    }
    const shaHasher = crypto.createHmac('sha256', salt);
    this.password = shaHasher.update(password).digest('hex');
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);