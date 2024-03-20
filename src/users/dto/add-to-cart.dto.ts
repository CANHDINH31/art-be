import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  paint: string;

  @IsNumber()
  @IsNumber()
  amount: number;
}
