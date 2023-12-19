import { GetProductOptionsDto } from 'src/entities/dtos/get-product-options.dto';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { GetResponse } from './get-response.interface';

export interface GetProductResponse {
  product: GetProductDto;
  productRequiredOptions: GetResponse<GetProductOptionsDto>;
  productOptions: GetResponse<GetProductOptionsDto>;
}
