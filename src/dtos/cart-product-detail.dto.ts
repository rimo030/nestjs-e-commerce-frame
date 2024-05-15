import { CartOptionDto } from './cart-option.dto';
import { CartRequiredOptionDto } from './cart-required-option.dto';
import { ProductRequiredOptionDto } from './product-required-option.dto';
import { ProductDto } from './product.dto';

export interface CartProductDetailDto {
  id: number;
  buyerId: number;
  productId: number;
  product: ProductDto;
  cartRequiredOptions: (CartRequiredOptionDto & { productRequiredOption: ProductRequiredOptionDto })[];
  cartOptions: (CartOptionDto & { productOption: ProductRequiredOptionDto })[];
}
