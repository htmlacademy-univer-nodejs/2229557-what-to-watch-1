import {IsEmail, IsString} from 'class-validator';

export default class LoginUserDto {
  @IsEmail({}, {message: 'Email should be valid address'})
  public email!: string;

  @IsString({message: 'Required'})
  public password!: string;
}
