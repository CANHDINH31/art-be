import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTargetDto {
  @IsArray()
  @IsOptional()
  urls: string[];

  @IsArray()
  @IsOptional()
  keywords: string[];

  @IsArray()
  @IsOptional()
  hashtags: string[];

  @IsString()
  @IsNotEmpty()
  profile: string;
}
