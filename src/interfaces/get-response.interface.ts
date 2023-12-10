export interface GetResponse<T> {
  list: T[];
  count: number;
  take: number;
}
