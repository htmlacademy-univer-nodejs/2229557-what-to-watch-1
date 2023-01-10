import {Genre} from '../../../models/genre.js';
import {IsArray, IsDateString, IsEnum, IsInt, IsMongoId, IsString, Length, Matches, Max, Min} from 'class-validator';

export default class CreateFilmDto {

  @Length(2, 100, {message: 'Should be from 2 to 100 symbols'})
  public title!: string;

  @Length(20, 1024, {message: 'Should be from 20 to 1024 symbols'})
  public description!: string;

  @IsDateString({}, {message: 'Should be date'})
  public publicationDate!: Date;

  @IsEnum(Genre, {message: 'genre must be one of: \'comedy\', \'crime\', \'documentary\', \'drama\', \'horror\', \'family\', \'romance\', \'scifi\', \'thriller\''})
  public genre!: Genre;

  @IsInt({message: 'releaseYear must be an integer'})
  @Min(1900, {message: 'Minimum releaseYear is 1900'})
  @Max(2023, {message: 'Maximum releaseYear is 2022'})
  public releaseYear!: number;

  public rating!: number;

  @IsString({message: 'previewLink is required'})
  public previewLink!: string;

  @IsString({message: 'link is required'})
  public link!: string;

  @IsArray({message: 'Field actors must be an array'})
  public actors!: string[];

  @IsString({message: 'producer is required'})
  public producer!: string;

  @IsInt({message: 'durationInMinutes must be an integer'})
  @Min(0, {message: 'durationInMinutes can not be less than 0'})
  public durationInMinutes!: number;

  @IsMongoId({message: 'userId field must be valid an id'})
  public userId!: string;

  @Matches(/(\S+(\.jpg)$)/, {message: 'Should be .jpg'})
  @IsString({message: 'posterPath is required'})
  public posterLink!: string;

  @Matches(/(\S+(\.jpg)$)/, {message: 'Should be .jpg'})
  @IsString({message: 'Required'})
  public backgroundImageLink!: string;

  @IsString({message: 'Required'})
  public backgroundColor!: string;
}
