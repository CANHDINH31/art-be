import { IsNotEmpty, IsString } from 'class-validator';

export class ListDeletePaintDto {
  @IsNotEmpty()
  @IsString({ each: true })
  listIdDelete: string[];
}
