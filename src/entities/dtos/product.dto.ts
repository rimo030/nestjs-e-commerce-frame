import { deliveryType } from 'src/types/enums/delivery-type.enum';
import { ProductEntity } from '../product.entity';

export class ProductDto {
  id: number;
  sellerId!: number;
  bundleId?: number | null;
  categoryId!: number;
  companyId!: number;
  isSale!: boolean;
  name!: string;
  description?: string | null;
  deliveryType!: keyof typeof deliveryType;
  deliveryFreeOver?: number | null;
  deliveryCharge!: number;
  img!: string;

  constructor(product: ProductEntity) {
    this.id = product.id;
    this.sellerId = product.sellerId;
    this.bundleId = product.bundleId;
    this.categoryId = product.categoryId;
    this.companyId = product.companyId;
    this.isSale = product.isSale;
    this.name = product.name;
    this.description = product.description;
    this.deliveryType = product.deliveryType;
    this.deliveryFreeOver = product.deliveryFreeOver;
    this.deliveryCharge = product.deliveryCharge;
    this.img = product.img;
  }
}
