import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { PaginationResponseForm } from 'src/interfaces/pagination-response-form.interface';
import { getTotalPage } from './get-total-page.function';

/**
 * @param {GetResponse} getResponse This properties are created by typeorm methods.
 * @param {PaginationDto} paginationDto
 * @returns
 */
export function createPaginationForm<T>(
  getResponse: GetResponse<T>,
  paginationDto: PaginationDto,
): PaginationResponseForm<T> {
  const { list, count } = getResponse;
  const response = getTotalPage(count, paginationDto.limit);
  return { data: { ...response, list } };
}