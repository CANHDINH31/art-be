import { IsEmail, IsString } from 'class-validator';

export class ConditionUserDto {
  @IsEmail()
  email?: string;
  @IsString()
  password?: string;
  @IsString()
  _id?: string;
  @IsString()
  provider?: string;
}
