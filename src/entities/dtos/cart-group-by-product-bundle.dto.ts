import { chargeStandard } from 'src/types/enums/charge-standard.enum';
import { CartProductDetailDto } from './cart-product-detail.dto';

export class CartGroupByProductBundleDto {
  bundleId?: number | null;
  chargeStandard?: keyof typeof chargeStandard | null;
  bundleDeliveryFee!: number;
  cartDetail!: CartProductDetailDto[];
}
