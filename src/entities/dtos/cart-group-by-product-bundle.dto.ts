import { CartProductDetailDto } from './cart-product-detail.dto';

export class CartGroupByProductBundleDto {
  bundleId?: number | null;
  chargeStandard?: string | null;
  fixedDeliveryFee!: number;
  cartDetail!: CartProductDetailDto[];
}
