import { IsNumber, IsOptional } from 'class-validator';

export class UpdateDetailPaintDto {
  @IsNumber()
  @IsOptional()
  price?: number;
  @IsNumber()
  @IsOptional()
  stock?: number;
}
