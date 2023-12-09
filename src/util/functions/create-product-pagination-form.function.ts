import { NotFoundException } from '@nestjs/common';
import { ProductPaginationDto } from 'src/entities/dtos/product-pagination.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { GetProductResponse } from 'src/types/get-product-response.type';
import { getTotalPage } from './get-total-page.function';

export function createProductPaginationForm(
  getResponse: GetResponse<ProductEntity>,
  getProductDto: ProductPaginationDto,
): GetProductResponse {
  const { list, count } = getResponse;
  const totalPage = getTotalPage(count, getProductDto.limit);

  const lastProductId = list.at(list.length - 1)?.id;
  const result: GetProductResponse = {
    data: { list },
    meta: { lastProductId: lastProductId ?? null, ...totalPage, ...getProductDto },
  };

  return result;
}
