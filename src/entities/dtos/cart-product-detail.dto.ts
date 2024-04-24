import { Omit } from 'src/types/omit-type';
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
  product!: ProductDto;
  cartRequiredOptions!: (CartRequiredOptionDto & Omit<ProductRequiredOptionDto, 'id'>)[];
  cartOptions!: (CartOptionDto & Omit<ProductOptionDto, 'id'>)[];

  constructor(cart: CartEntity) {
    this.id = cart.id;
    this.buyerId = cart.buyerId;
    this.productId = cart.productId;
    this.product = new ProductDto(cart.product);
    this.cartRequiredOptions = cart.cartRequiredOptions.map((ro) => {
      return {
        id: ro.id,
        cartId: ro.cartId,
        productId: ro.productRequiredOption.productId,
        productRequiredOptionId: ro.productRequiredOptionId,
        count: ro.count,
        price: ro.productRequiredOption.price,
        name: ro.productRequiredOption.name,
        isSale: ro.productRequiredOption.isSale,
      };
    });
    this.cartOptions = cart.cartOptions.map((o) => {
      return {
        id: o.id,
        cartId: o.cartId,
        productId: o.productOption.productId,
        productOptionId: o.productOptionId,
        count: o.count,
        price: o.productOption.price,
        name: o.productOption.name,
        isSale: o.productOption.isSale,
      };
    });
  }
}
