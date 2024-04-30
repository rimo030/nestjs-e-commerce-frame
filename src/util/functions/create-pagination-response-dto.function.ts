import { PaginationResponseDto } from 'src/entities/dtos/pagination-response.dto';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { getTotalPage } from './get-total-page.function';

export function createPaginationResponseDto<T>(response: GetResponse<T>): PaginationResponseDto<T> {
  return {
    data: response.data,
    meta: {
      page: response.skip / response.take + 1,
      take: response.take,
      totalCount: response.take,
      totalPage: getTotalPage(response.count, response.take),
    },
  };
}
