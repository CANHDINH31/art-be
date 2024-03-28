import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateTargetDto {
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
}
