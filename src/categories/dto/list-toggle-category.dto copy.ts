import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ToggleCategoryDto } from './toggle-category.dto copy';

export class ListToggleCategoryDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ToggleCategoryDto)
  listCategories: ToggleCategoryDto[];
}
