import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateByUsernameDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  joinDate?: string;

  @IsOptional()
  @IsString()
  follower?: string;

  @IsOptional()
  @IsString()
  following?: string;
}
