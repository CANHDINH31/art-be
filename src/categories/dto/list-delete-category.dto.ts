import { IsNotEmpty, IsString } from 'class-validator';

export class ListDeleteCategoryDto {
  @IsNotEmpty()
  @IsString({ each: true })
  listIdDelete: string[];
}
