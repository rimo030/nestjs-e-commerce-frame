export interface CommonResponse<T> {
  data: T;
  message?: string | null;
}
