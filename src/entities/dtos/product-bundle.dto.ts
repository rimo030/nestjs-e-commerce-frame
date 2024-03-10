import { feeStandard } from 'src/types/enums/fee-standard.enum';
import { ProductBundleEntity } from '../product-bundle.entity';

export class ProductBundleDto {
  id: number;
  sellerId: number;
  name: string;
  chargeStandard: keyof typeof feeStandard;

  constructor(productBundle: ProductBundleEntity) {
    this.id = productBundle.id;
    this.sellerId = productBundle.sellerId;
    this.name = productBundle.name;
    this.chargeStandard = productBundle.chargeStandard;
  }
}
