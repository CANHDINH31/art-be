import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateByCrawlProfileDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  joinDate: string;

  @IsOptional()
  @IsNumber()
  follower: string;

  @IsOptional()
  @IsNumber()
  following: string;
}
