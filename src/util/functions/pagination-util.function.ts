import { GetPaginationDto } from 'src/dtos/get-pagination.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { PaginationResponse } from 'src/interfaces/pagination-response.interface';

/**
 * 페이지네이션에서 전체페이지 계산을 위한 함수 입니다.
 *
 * totalCount : 전체 요소의 수
 * limit : 한번에 읽어올 요소의 수
 *
 */
export const getTotalPage = (totalCount = 0, limit = 0): number => {
  const totalPage = totalCount % limit === 0 ? totalCount / limit : Math.floor(totalCount / limit) + 1;
  return totalPage;
};

/**
 * 아무런 page와 limit와 주지 않으면
 * 첫번째 페이지의 10개의 요소를 가져와 보여줍니다.
 */
export const DEFAULT_SKIP = 0 as const;
export const DEFAULT_TAKE = 10 as const;

/**
 * 페이지네이션을 계산하기 편하게 하기 위한 유틸 함수 입니다.
 */
export const getOffset = (paginationDto: GetPaginationDto): { skip: number; take: number } => {
  const { page, limit } = paginationDto;
  const take = limit ?? DEFAULT_TAKE;
  const pageToSkip = page ?? DEFAULT_SKIP;
  const skip = pageToSkip > 1 ? take * (pageToSkip - 1) : 0;
  return { skip, take };
};

/**
 * 페이지네이션 응답 형태를 만들기 위한 유틸 함수 입니다.
 */
export function createPaginationResponseDto<T>(response: PaginationResponse<T>): PaginationDto<T> {
  return {
    data: response.data,
    meta: {
      page: response.skip / response.take + 1,
      take: response.take,
      totalCount: response.count,
      totalPage: getTotalPage(response.count, response.take),
    },
  };
}
