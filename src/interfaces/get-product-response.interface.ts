import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { GetResponse } from './get-response.interface';

export interface GetProductResponse {
  product: ProductEntity;
  productRequiredOptions: GetResponse<ProductRequiredOptionEntity>;
  productOptions: GetResponse<ProductOptionEntity>;
}
