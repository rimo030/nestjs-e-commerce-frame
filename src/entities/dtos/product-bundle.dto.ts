import { chargeStandard } from 'src/types/charge-standard.type';

export interface ProductBundleDto {
  id: number;
  sellerId: number;
  name: string;
  chargeStandard: chargeStandard;
}
