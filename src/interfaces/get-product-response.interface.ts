import { GetProductOptionDto } from 'src/entities/dtos/get-product-options.dto';
import { GetProductRequiredOptionDto } from 'src/entities/dtos/get-product-required-option.dto';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { GetResponse } from './get-response.interface';

export interface GetProductResponse {
  product: GetProductDto;
  productRequiredOptions: GetResponse<GetProductRequiredOptionDto>;
  productOptions: GetResponse<GetProductOptionDto>;
}
