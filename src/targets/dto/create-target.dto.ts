import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTargetDto {
  @IsArray()
  @IsOptional()
  keywords: string[];

  @IsArray()
  @IsOptional()
  hashtags: string[];

  @IsNumber()
  @IsNotEmpty()
  views: number;

  @IsNumber()
  @IsNotEmpty()
  likes: number;

  @IsNumber()
  @IsNotEmpty()
  shares: number;

  @IsNumber()
  @IsNotEmpty()
  comments: number;

  @IsString()
  @IsNotEmpty()
  profile: string;
}
