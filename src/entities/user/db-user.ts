import
typegoose,
{
  Severity,
  defaultClasses,
  getModelForClass
} from '@typegoose/typegoose';

import { checkPassword, createSHA256 } from '../../utils/common.js';
import { User } from '../../models/user.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: { collection: 'users' },
  options: { allowMixed: Severity.ALLOW }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.name = data.name;
    this.email = data.email;
    this.avatar = data.avatar;
  }


  @prop({required: true })
  public name!: string;

  @prop({ unique: true, required: true })
  public email!: string;

  @prop({ required: false })
  public avatar: string | undefined;

  @prop({required: true, default: []})
  public filmsToWatch!: string[];

  @prop({ required: true })
  private password!: string;

  public verifyPassword(password: string, salt: string) {
    return createSHA256(password, salt) === this.password;
  }

  public setPassword(password: string, salt: string) {
    checkPassword(password);
    this.password = createSHA256(password, salt);
  }
}

export const UserModel = getModelForClass(UserEntity);
