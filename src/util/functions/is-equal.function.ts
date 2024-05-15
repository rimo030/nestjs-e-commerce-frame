import { HttpException, HttpStatus } from '@nestjs/common';

export class ObjectLengthError extends HttpException {
  constructor() {
    super(`Lengths of objects do not match.`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ObjectValueError extends HttpException {
  constructor(key: string) {
    super(`Value of objects do not match. key : ${key}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 객체 obj1과 obj2의 속성 및 값이 동일한지 확인합니다.
 */
export function isEqual(obj1: object, obj2: object) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    throw new ObjectLengthError();
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      throw new ObjectValueError(key);
    }
  }
  return true;
}
