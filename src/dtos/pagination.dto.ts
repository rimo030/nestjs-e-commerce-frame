export interface PaginationDto<T> {
  data: T[];
  meta: {
    page: number;
    take: number;
    totalCount: number;
    totalPage: number;
  };
}
