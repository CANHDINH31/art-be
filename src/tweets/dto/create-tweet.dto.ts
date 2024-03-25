import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTweetDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  profileId: string;
}
