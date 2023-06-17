import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';
import { Type } from 'class-transformer';

export class ListCreateCategoryDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  listCategories: CreateCategoryDto[];
}
