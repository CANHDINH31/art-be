import { IsNotEmpty, IsString } from 'class-validator';

export class SyncProfileDto {
  @IsNotEmpty()
  @IsString()
  appKey: string;

  @IsNotEmpty()
  @IsString()
  appSecret: string;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  accessSecret: string;
}
