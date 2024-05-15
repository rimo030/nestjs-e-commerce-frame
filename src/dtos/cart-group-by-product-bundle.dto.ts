import { CartProductDetailDto } from './cart-product-detail.dto';
import { ProductBundleDto } from './product-bundle.dto';

export interface CartGroupByProductBundleDto {
  bundle: ProductBundleDto | null;
  bundleDeliveryFee: number;
  cartDetails: CartProductDetailDto[];
}
