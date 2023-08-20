import { IsNotEmpty } from 'class-validator';

export class AddToCategoryDto {
  @IsNotEmpty()
  list_category_id: string[];
  list_paint_id: string[];
}
