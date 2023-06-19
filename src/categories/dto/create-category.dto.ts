import { IsNotEmpty, IsString } from 'class-validator';
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  url: string;
  title: string;
  @IsString()
  @IsNotEmpty()
  description: string;
}
