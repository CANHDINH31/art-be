import { IsOptional, IsString } from 'class-validator';

export class CreateAccessDto {
  @IsOptional()
  @IsString()
  visit: string;
}
