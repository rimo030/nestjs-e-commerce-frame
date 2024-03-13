import { ProductEntity } from '../product.entity';
import { PaginationResponseDto } from './pagination-response.dto';
import { ProductOptionDto } from './product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from './product-rquired-option-join-input-option.dto';
import { ProductDto } from './product.dto';

export class ProductAllOptionsDto extends ProductDto {
  productRequiredOptions: PaginationResponseDto<ProductRequiredOptionJoinInputOptionDto>;
  productOptions: PaginationResponseDto<ProductOptionDto>;

  constructor(
    product: ProductEntity,
    productRequiredOptions: PaginationResponseDto<ProductRequiredOptionJoinInputOptionDto>,
    productOptions: PaginationResponseDto<ProductOptionDto>,
  ) {
    super(product);
    this.productRequiredOptions = productRequiredOptions;
    this.productOptions = productOptions;
  }
}
