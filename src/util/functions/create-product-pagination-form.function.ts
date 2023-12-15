import { GetProductPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { GetProductListResponse } from 'src/interfaces/get-product-list-response.interface';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { getTotalPage } from './get-total-page.function';

export function createProductPaginationForm(
  getResponse: GetResponse<ProductEntity>,
  getProductPagintionDto: GetProductPaginationDto,
): GetProductListResponse {
  const { list, count, take } = getResponse;
  const totalPage = getTotalPage(count, take);

  const lastProductId = list.at(list.length - 1)?.id;
  const result: GetProductListResponse = {
    data: { list, ...totalPage, lastProductId: lastProductId ?? null },
    meta: getProductPagintionDto,
  };

  return result;
}
