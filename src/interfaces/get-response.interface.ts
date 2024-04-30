/**
 * @todo 삭제
 */

export interface _GetResponse<T> {
  list: T[];
  count: number;
  take: number;
}

export interface GetResponse<T> {
  data: T[];
  skip: number;
  count: number;
  take: number;
}
