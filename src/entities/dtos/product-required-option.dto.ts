import { ProductRequiredOptionEntity } from '../product-required-option.entity';

export class ProductRequiredOptionDto {
  id: number;
  productId: number;
  name: string;
  price: number;
  isSale: boolean;

  constructor(requiredOption: ProductRequiredOptionEntity) {
    this.id = requiredOption.id;
    this.productId = requiredOption.productId;
    this.name = requiredOption.name;
    this.price = requiredOption.price;
    this.isSale = requiredOption.isSale;
  }
}
