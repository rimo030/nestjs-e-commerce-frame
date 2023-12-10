export interface PaginationResponseForm<T> {
  data: { list: T[]; totalPage: number };
  meta: {};
}
