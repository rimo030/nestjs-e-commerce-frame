import { CartOptionDto } from './cart-option.dto';
import { CartRequiredOptionDto } from './cart-required-option.dto';

export interface CartDto {
  id: number;
  productId: number;
  buyerId: number;
  cartRequiredOptions: CartRequiredOptionDto[];
  cartOptions: CartOptionDto[];
}
