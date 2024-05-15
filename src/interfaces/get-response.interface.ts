export interface GetResponse<T> {
  data: T[];
  skip: number;
  count: number;
  take: number;
}
