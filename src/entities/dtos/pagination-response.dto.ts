import { getTotalPage } from 'src/util/functions/get-total-page.function';

export class PaginationResponseDto<T> {
  data: T[];
  meta: {
    page: number;
    take: number;
    totalCount: number;
    totalPage: number;
  };

  constructor(data: T[], skip: number, count: number, take: number) {
    this.data = data;
    this.meta = { page: skip, take, totalCount: count, totalPage: getTotalPage(count, take) };
  }
}
