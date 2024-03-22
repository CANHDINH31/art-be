import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AddToCartDto } from 'src/users/dto/add-to-cart.dto';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNotEmpty()
  @IsString()
  user: string;

  @IsArray()
  cart: AddToCartDto[];
}
