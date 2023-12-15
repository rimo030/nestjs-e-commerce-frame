import { GetProductPaginationDto } from 'src/entities/dtos/product-pagination.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { GetProductResponse } from 'src/interfaces/get-product-response.interface';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { getTotalPage } from './get-total-page.function';

export function createProductPaginationForm(
  getResponse: GetResponse<ProductEntity>,
  getProductPagintionDto: GetProductPaginationDto,
): GetProductResponse {
  const { list, count, take } = getResponse;
  const totalPage = getTotalPage(count, take);

  const lastProductId = list.at(list.length - 1)?.id;
  const result: GetProductResponse = {
    data: { list, ...totalPage, lastProductId: lastProductId ?? null },
    meta: getProductPagintionDto,
  };

  return result;
}
