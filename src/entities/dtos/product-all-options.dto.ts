import { PaginationDto } from './pagination.dto';
import { ProductOptionDto } from './product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from './product-rquired-option-join-input-option.dto';
import { ProductDto } from './product.dto';

export interface ProductAllOptionsDto {
  product: ProductDto;
  productRequiredOptions: PaginationDto<ProductRequiredOptionJoinInputOptionDto>;
  productOptions: PaginationDto<ProductOptionDto>;
}
