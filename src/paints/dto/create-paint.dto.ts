import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaintDto {
  @IsString()
  @IsNotEmpty()
  url: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsNumber()
  @IsOptional()
  total_score: number;
  @IsNumber()
  @IsOptional()
  account_users_rate: number;
}
