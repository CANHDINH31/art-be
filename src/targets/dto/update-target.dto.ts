import { IsArray, IsOptional } from 'class-validator';

export class UpdateTargetDto {
  @IsArray()
  @IsOptional()
  urls: string[];

  @IsArray()
  @IsOptional()
  keywords: string[];

  @IsArray()
  @IsOptional()
  hashtags: string[];
}
