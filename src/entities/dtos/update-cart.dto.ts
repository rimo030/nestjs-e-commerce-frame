import { CartOptionEntity } from '../cart-option.entity';
import { CartRequiredOptionEntity } from '../cart-required-option.entity';
import { CartEntity } from '../cart.entity';
import { CartDto } from './cart.dto';

export class UpdateCartDto extends CartDto {
  updateCartRequiredOptionIds: number[];
  updateCartOptionIds: number[];

  constructor(data: {
    cart: CartEntity;
    updateCartRequiredOptionIds: number[];
    cartRequiredOptions: CartRequiredOptionEntity[];
    updateCartOptionIds: number[];
    cartOptions: CartOptionEntity[];
  }) {
    super(data.cart, data.cartRequiredOptions, data.cartOptions);
    this.updateCartRequiredOptionIds = data.updateCartRequiredOptionIds;
    this.updateCartOptionIds = data.updateCartOptionIds;
  }
}
