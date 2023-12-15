import { PaginationDto } from 'src/entities/dtos/pagination.dto';

/**
 * 아무런 page와 limit와 주지 않으면
 * 첫번째 페이지의 10개의 요소를 가져와 보여준다.
 */
export const DEFAULT_SKIP = 0 as const;
export const DEFAULT_TAKE = 10 as const;

/**
 * 페이지네이션을 계산하기 편하게 하기 위해 유틸 함수를 만든다.
 * @param paginationDto
 * @returns
 */
export const getOffset = (paginationDto: PaginationDto): { skip: number; take: number } => {
  const { page, limit } = paginationDto;
  const take = limit ?? DEFAULT_TAKE;
  const pageToSkip = page ?? DEFAULT_SKIP;
  const skip = pageToSkip > 1 ? take * (pageToSkip - 1) : 0;
  return { skip, take };
};
