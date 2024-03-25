import { IsNotEmpty, IsString } from 'class-validator';

export class AiTweetDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;
}
