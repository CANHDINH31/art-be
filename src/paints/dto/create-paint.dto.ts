import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaintDto {
  @IsString()
  @IsNotEmpty()
  url: string;
  @IsString()
  @IsNotEmpty()
  title: string;
}
