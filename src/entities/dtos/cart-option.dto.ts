import { CartOptionEntity } from '../cart-option.entity';

export class CartOptionDto {
  id: number;
  cartId: number;
  productOptionId: number;
  count: number;

  constructor(cartOptionEntity: CartOptionEntity) {
    this.id = cartOptionEntity.id;
    this.cartId = cartOptionEntity.cartId;
    this.productOptionId = cartOptionEntity.productOptionId;
    this.count = cartOptionEntity.count;
  }
}
