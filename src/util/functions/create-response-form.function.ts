import { GetResponse } from 'src/interfaces/get-response.interface';
import { PaginationResponseForm } from 'src/interfaces/pagination-response-form.interface';
import { ResponseForm } from 'src/interfaces/response-form.interface';
import { PaginationDto } from 'src/util/pagination/pagination.dto';
import { isPaginationResponseTypeGuard } from '../type-guards/is-pagination-response-type-guard';
import { getTotalPage } from './get-total-page.function';

function createPaginationForm<T>(getResponse: GetResponse<T>, paginationDto: PaginationDto): PaginationResponseForm<T> {
  const { list, count, take } = getResponse;
  const totalPage = getTotalPage(count, take);
  return { data: { ...totalPage, list }, meta: { ...paginationDto } };
}

export function createResponseForm<T>(data: object | boolean | string | number | BigInt): ResponseForm<T>;
export function createResponseForm<T>(data: GetResponse<T>, paginationDto: PaginationDto): PaginationResponseForm<T>;
export function createResponseForm<T>(
  data: GetResponse<T> | (object | boolean | string | number | BigInt),
  paginationDto?: PaginationDto,
) {
  if (paginationDto !== undefined) {
    if (isPaginationResponseTypeGuard(data)) {
      return createPaginationForm(data, paginationDto);
    }
  }
  return { data };
}
