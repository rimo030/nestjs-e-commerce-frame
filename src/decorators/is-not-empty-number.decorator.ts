import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

/**
 * @todo
 * Number 데코레이터들은 int인지 모든 숫자인지 따로 받아야 한다.
 *
 */
export function IsNotEmptyNumber(type: 'number' | 'int' = 'number') {
  return applyDecorators(
    IsNotEmpty(),
    type === 'int' ? IsInt() : IsNumber(),
    Type(() => Number),
  );
}
