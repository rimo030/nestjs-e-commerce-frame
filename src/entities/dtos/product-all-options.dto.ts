import { PaginationResponseDto } from './pagination-response.dto';
import { ProductOptionDto } from './product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from './product-rquired-option-join-input-option.dto';
import { ProductDto } from './product.dto';

export interface ProductAllOptionsDto {
  product: ProductDto;
  productRequiredOptions: PaginationResponseDto<ProductRequiredOptionJoinInputOptionDto>;
  productOptions: PaginationResponseDto<ProductOptionDto>;
}
