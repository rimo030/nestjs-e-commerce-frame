import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsNotEmptyNumber(type: 'number' | 'int' = 'number', option?: { min?: number; max?: number }) {
  return applyDecorators(
    IsNotEmpty(),
    type === 'int' ? IsInt() : IsNumber(),
    ...(typeof option?.min === 'number' ? [Min(option.min)] : []),
    ...(typeof option?.max === 'number' ? [Max(option.max)] : []),
    Type(() => Number),
  );
}
