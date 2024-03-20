import { CartEntity } from '../cart.entity';
import { CartProductDetailDto } from './cart-product-detail.dto';

export class CartGroupByProductBundleDto {
  bundleId: number | null;
  chargeStandard: string;
  fixedDeliveryFee: number;
  cartDetail: CartProductDetailDto[];

  constructor(data: {
    bundleId: number | null;
    chargeStandard: string;
    fixedDeliveryFee: number;
    carts: CartEntity[];
  }) {
    this.bundleId = data.bundleId;
    this.chargeStandard = data.chargeStandard;
    this.fixedDeliveryFee = data.fixedDeliveryFee;
    this.cartDetail = data.carts.map((c) => new CartProductDetailDto(c));
  }
}
