import { IsNotEmpty, IsString } from 'class-validator';

export class ListDeleteUserDto {
  @IsNotEmpty()
  @IsString({ each: true })
  listIdDelete: string[];
}
