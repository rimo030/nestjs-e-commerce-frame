export interface PaginationResponse<T> {
  data: T[];
  skip: number;
  count: number;
  take: number;
}
