import { UpdateResult } from 'typeorm';
import { CartOptionEntity } from '../cart-option.entity';
import { CartRequiredOptionEntity } from '../cart-required-option.entity';
import { CartEntity } from '../cart.entity';
import { CartOptionDto } from './cart-option.dto';
import { CartRequiredOptionDto } from './cart-required-option.dto';

export class CartDto {
  id: number;
  productId: number;
  buyerId: number;
  updateRequiredOptionsResult: UpdateResult | [];
  cartRequiredOptions: CartRequiredOptionDto[];
  updateOptionsResult: UpdateResult | [];
  cartOptions: CartOptionDto[];

  constructor(
    cart: CartEntity,
    updateRequiredOptionsResult: UpdateResult | [],
    cartRequiredOptions: CartRequiredOptionEntity[],
    updateOptionsResult: UpdateResult | [],
    cartOptionDto: CartOptionEntity[],
  ) {
    this.id = cart.id;
    this.productId = cart.productId;
    this.buyerId = cart.buyerId;
    this.updateRequiredOptionsResult = updateRequiredOptionsResult;
    this.cartRequiredOptions = cartRequiredOptions.map((c) => new CartRequiredOptionDto(c));
    this.updateOptionsResult = updateOptionsResult;
    this.cartOptions = cartOptionDto.map((c) => new CartOptionDto(c));
  }
}
