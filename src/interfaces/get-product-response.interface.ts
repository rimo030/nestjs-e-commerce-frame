import { GetProductDto } from 'src/seller/dto/get.product.dto';
import { GetProductOptionDto } from 'src/seller/dto/get.product.options.dto';
import { GetProductRequiredOptionDto } from 'src/seller/dto/get.product.required.option.dto';
import { GetResponse } from './get-response.interface';

export interface GetProductResponse {
  product: GetProductDto;
  productRequiredOptions: GetResponse<GetProductRequiredOptionDto>;
  productOptions: GetResponse<GetProductOptionDto>;
}
