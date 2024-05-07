import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SyncRateDto {
  @IsOptional()
  @IsString()
  visit?: string;
  @IsNotEmpty()
  @IsNumber()
  value: number;
  @IsNotEmpty()
  @IsString()
  paint_id: string;
}
