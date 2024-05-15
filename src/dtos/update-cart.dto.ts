import { CartOptionDto } from './cart-option.dto';
import { CartRequiredOptionDto } from './cart-required-option.dto';
import { CartDto } from './cart.dto';

export interface UpdateCartDto extends CartDto {
  updateCartRequiredOptions: CartRequiredOptionDto[];
  updateCartOptions: CartOptionDto[];
}
