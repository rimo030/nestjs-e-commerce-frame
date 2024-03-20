import { CartEntity } from '../cart.entity';
import { CartOptionDto } from './cart-option.dto';
import { CartRequiredOptionDto } from './cart-required-option.dto';
import { ProductOptionDto } from './product-option.dto';
import { ProductRequiredOptionDto } from './product-required-option.dto';
import { ProductDto } from './product.dto';

export class CartProductDetailDto {
  id!: number;
  buyerId!: number;
  productId!: number;
  product: ProductDto;
  cartRequiredOptions!: (CartRequiredOptionDto & ProductRequiredOptionDto)[];
  cartOptions!: (CartOptionDto & ProductOptionDto)[];

  constructor(cart: CartEntity) {
    this.id = cart.id;
    this.buyerId = cart.buyerId;
    this.productId = cart.productId;
    this.product = new ProductDto(cart.product);
    this.cartRequiredOptions = cart.cartRequiredOptions.map((ro) => {
      return { ...new CartRequiredOptionDto(ro), ...new ProductRequiredOptionDto(ro.productRequiredOption) };
    });
    this.cartOptions = cart.cartOptions.map((o) => {
      return { ...new CartOptionDto(o), ...new ProductOptionDto(o.productOption) };
    });
  }
}
