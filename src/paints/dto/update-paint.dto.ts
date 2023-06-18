import { PartialType } from '@nestjs/swagger';
import { CreatePaintDto } from './create-paint.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaintDto extends PartialType(CreatePaintDto) {
  @IsNotEmpty()
  @IsString()
  _id: string;
}
