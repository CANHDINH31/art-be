import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateCategoryDto } from './update-category.dto';

export class ListUpdateCategoryDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateCategoryDto)
  listCategories: UpdateCategoryDto[];
}
