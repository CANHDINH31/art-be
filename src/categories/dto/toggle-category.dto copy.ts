import { IsNotEmpty, IsString } from 'class-validator';
export class ToggleCategoryDto {
  @IsString()
  @IsNotEmpty()
  _id: string;
  list_paint_id: string[];
}
