import { deliveryType } from 'src/types/delivery-type.type';

export interface ProductDto {
  id: number;
  sellerId: number;
  bundleId: number | null;
  categoryId: number;
  companyId: number;
  isSale: boolean;
  name: string;
  description: string | null;
  deliveryType: deliveryType;
  deliveryFreeOver: number | null;
  deliveryCharge: number;
  img: string;
}
