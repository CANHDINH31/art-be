import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SyncRateDto {
  @IsNotEmpty()
  @IsNumber()
  value: number;
  @IsNotEmpty()
  @IsString()
  paint_id: string;
}
