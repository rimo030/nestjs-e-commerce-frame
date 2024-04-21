import { feeStandard } from 'src/types/enums/fee-standard.enum';
import { CartProductDetailDto } from './cart-product-detail.dto';

export class CartGroupByProductBundleDto {
  bundleId?: number | null;
  chargeStandard?: keyof typeof feeStandard | null;
  fixedDeliveryFee!: number;
  cartDetail!: CartProductDetailDto[];
}
