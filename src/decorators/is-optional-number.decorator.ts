import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsOptionalNumber(type: 'number' | 'int' = 'number', option?: { min?: number; max?: number }) {
  return applyDecorators(
    IsOptional(),
    type === 'int' ? IsInt() : IsNumber(),
    ...(typeof option?.min === 'number' ? [Min(option.min)] : []),
    ...(typeof option?.max === 'number' ? [Max(option.max)] : []),
    Type(() => Number),
  );
}
