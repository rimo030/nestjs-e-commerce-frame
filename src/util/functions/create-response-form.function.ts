import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { PaginationResponseForm } from 'src/interfaces/pagination-response-form.interface';
import { getTotalPage } from './get-total-page.function';

function PaginationTypeGuard(data: any): data is GetResponse<any> {
  if (typeof data === 'object' && data !== null) {
    if (data.list instanceof Array && typeof data.count === 'number' && typeof data.take === 'number') {
      return true;
    }
  }
  return false;
}

function createPaginationForm<T>(getResponse: GetResponse<T>, paginationDto: PaginationDto): PaginationResponseForm<T> {
  const { list, count, take } = getResponse;
  const totalPage = getTotalPage(count, take);
  return { data: { ...totalPage, list }, meta: { ...paginationDto } };
}

export function createResponseForm<T>(data: object | boolean | string | number | BigInt): { data: 'DATA' };
export function createResponseForm<T>(data: GetResponse<T>, paginationDto: PaginationDto): PaginationResponseForm<T>;
export function createResponseForm<T>(
  data: GetResponse<T> | (object | boolean | string | number | BigInt),
  paginationDto?: PaginationDto,
) {
  if (paginationDto !== undefined) {
    if (PaginationTypeGuard(data)) {
      return createPaginationForm(data, paginationDto);
    }
  }
  return { data };
}
