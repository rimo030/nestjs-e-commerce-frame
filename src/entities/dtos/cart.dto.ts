import { CartOptionEntity } from '../cart-option.entity';
import { CartRequiredOptionEntity } from '../cart-required-option.entity';
import { CartEntity } from '../cart.entity';
import { CartOptionDto } from './cart-option.dto';
import { CartRequiredOptionDto } from './cart-required-option.dto';

export class CartDto {
  id: number;
  productId: number;
  buyerId: number;
  cartRequiredOptions: CartRequiredOptionDto[];
  cartOptions: CartOptionDto[];

  constructor(cart: CartEntity, cartRequiredOptions: CartRequiredOptionEntity[], cartOptions: CartOptionEntity[]) {
    this.id = cart.id;
    this.productId = cart.productId;
    this.buyerId = cart.buyerId;
    this.cartRequiredOptions = cartRequiredOptions.map((c) => new CartRequiredOptionDto(c));
    this.cartOptions = cartOptions.map((c) => new CartOptionDto(c));
  }
}
