import { ProductRequiredOptionEntity } from '../product-required-option.entity';
import { ProductInputOptionDto } from './product-input-option.dto';

export class ProductRequiredOptionJoinInputOptionDto {
  id: number;
  productId: number;
  name: string;
  price: number;
  isSale: boolean;
  productInputOptions: ProductInputOptionDto[];

  constructor(requiredOption: ProductRequiredOptionEntity, productInputOptions: ProductInputOptionDto[]) {
    this.id = requiredOption.id;
    this.productId = requiredOption.productId;
    this.name = requiredOption.name;
    this.price = requiredOption.price;
    this.isSale = requiredOption.isSale;
    this.productInputOptions = productInputOptions;
  }
}
