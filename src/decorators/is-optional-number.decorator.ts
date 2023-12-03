import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsOptionalNumber(type: 'number' | 'int' = 'number') {
  return applyDecorators(
    IsOptional(),
    type === 'int' ? IsInt() : IsNumber(),
    Type(() => Number),
  );
}
