import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePaintDto } from './create-paint.dto';

export class ListCreatePaintDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePaintDto)
  listPaints: CreatePaintDto[];
}
