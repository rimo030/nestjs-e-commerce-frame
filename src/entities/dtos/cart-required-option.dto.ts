import { CartRequiredOptionEntity } from '../cart-required-option.entity';

export class CartRequiredOptionDto {
  id: number;
  cartId: number;
  productRequiredOptionId: number;
  count: number;

  constructor(cartRequiredOption: CartRequiredOptionEntity) {
    this.id = cartRequiredOption.id;
    this.cartId = cartRequiredOption.cartId;
    this.productRequiredOptionId = cartRequiredOption.productRequiredOptionId;
    this.count = cartRequiredOption.count;
  }
}
