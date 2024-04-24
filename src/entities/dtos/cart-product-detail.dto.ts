import { CartOptionEntity } from '../cart-option.entity';
import { CartRequiredOptionEntity } from '../cart-required-option.entity';
import { CartEntity } from '../cart.entity';
import { ProductOptionEntity } from '../product-option.entity';
import { ProductRequiredOptionEntity } from '../product-required-option.entity';
import { ProductDto } from './product.dto';

export class CartProductDetailDto {
  id!: number;
  buyerId!: number;
  productId!: number;
  product: ProductDto;
  cartRequiredOptions!: (Pick<CartRequiredOptionEntity, 'id' | 'cartId' | 'productRequiredOptionId' | 'count'> &
    Pick<ProductRequiredOptionEntity, 'productId' | 'price' | 'name' | 'isSale'>)[];
  cartOptions!: (Pick<CartOptionEntity, 'id' | 'cartId' | 'productOptionId' | 'count'> &
    Pick<ProductOptionEntity, 'productId' | 'price' | 'name' | 'isSale'>)[];

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
