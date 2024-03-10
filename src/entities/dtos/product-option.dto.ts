import { ProductOptionEntity } from '../product-option.entity';

export class ProductOptionDto {
  id: number;
  productId: number;
  name: string;
  price: number;
  isSale: boolean;

  constructor(option: ProductOptionEntity) {
    this.id = option.id;
    this.productId = option.productId;
    this.name = option.name;
    this.price = option.price;
    this.isSale = option.isSale;
  }
}
