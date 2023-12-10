import { ProductPaginationDto } from 'src/entities/dtos/product-pagination.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { GetProductResponse } from 'src/types/get-product-response.type';
import { getTotalPage } from './get-total-page.function';

export function createProductPaginationForm(
  getResponse: GetResponse<ProductEntity>,
  getProductDto: ProductPaginationDto,
): GetProductResponse {
  const { list, count, take } = getResponse;
  const totalPage = getTotalPage(count, take);

  const lastProductId = list.at(list.length - 1)?.id;
  const result: GetProductResponse = {
    data: { list, ...totalPage },
    meta: { lastProductId: lastProductId ?? null, ...getProductDto },
  };

  return result;
}
