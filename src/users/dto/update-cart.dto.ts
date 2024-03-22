import { IsArray } from 'class-validator';
import { AddToCartDto } from './add-to-cart.dto';

export class UpdateCartDto {
  @IsArray()
  listCart: AddToCartDto[];
}
