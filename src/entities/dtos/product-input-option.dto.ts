import { ProductInputOptionEntity } from '../product-input-option.entity';

export class ProductInputOptionDto {
  id: number;
  productRequiredOptionId!: number;
  name: string;
  value: string;
  description: string;
  isRequired: boolean;

  constructor(option: ProductInputOptionEntity) {
    this.id = option.id;
    this.productRequiredOptionId = option.productRequiredOptionId;
    this.name = option.name;
    this.value = option.value;
    this.description = option.description;
    this.isRequired = option.isRequired;
  }
}
