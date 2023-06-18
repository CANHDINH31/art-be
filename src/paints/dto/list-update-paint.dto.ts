import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdatePaintDto } from './update-paint.dto';

export class ListUpdatePaintDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdatePaintDto)
  listPaints: UpdatePaintDto[];
}
