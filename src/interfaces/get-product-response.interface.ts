import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';

export interface GetProductResponse {
  product: ProductEntity;
  productRequiredOptions: ProductRequiredOptionEntity[];
  productOptions: ProductOptionEntity[];
}
