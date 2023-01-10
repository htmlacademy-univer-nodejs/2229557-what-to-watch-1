import {IsEmail, IsString, Length, Matches} from 'class-validator';

export default class CreateUserDto {
  @IsEmail({}, {message: 'Email should be valid address'})
  public email!: string;

  @IsString({message: 'Required'})
  public name!: string;

  @IsString({message: 'Required'})
  @Length(6, 12, {message: 'Min length for password is 6, max is 12'})
  public password!: string;

  @Matches(/[^\\s]+(.*?)\\.(jpg|png)$/, {message: 'Avatar should be .jpg or .png'})
  public avatar?: string;
}
