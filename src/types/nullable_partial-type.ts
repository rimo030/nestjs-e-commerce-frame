export type NullablePartial<T> = {
  [key in keyof T]?: T[key] | null;
};
