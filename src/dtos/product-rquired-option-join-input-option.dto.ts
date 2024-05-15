import { ProductInputOptionDto } from './product-input-option.dto';

export interface ProductRequiredOptionJoinInputOptionDto {
  id: number;
  productId: number;
  name: string;
  price: number;
  isSale: boolean;
  productInputOptions: ProductInputOptionDto[];
}
