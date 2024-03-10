import { ProductEntity } from '../product.entity';
import { PaginationResponseDto } from './pagination-response.dto';
import { ProductOptionDto } from './product-option.dto';
import { ProductRequiredOptionDto } from './product-required-option.dto';
import { ProductDto } from './product.dto';

export class ProductAllOptionsDto extends ProductDto {
  productRequiredOptions: PaginationResponseDto<ProductRequiredOptionDto>;
  productOptions: PaginationResponseDto<ProductOptionDto>;

  constructor(
    product: ProductEntity,
    productRequiredOptions: PaginationResponseDto<ProductRequiredOptionDto>,
    productOptions: PaginationResponseDto<ProductOptionDto>,
  ) {
    super(product);
    this.productRequiredOptions = productRequiredOptions;
    this.productOptions = productOptions;
  }
}
