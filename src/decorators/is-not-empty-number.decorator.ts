import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsNotEmptyNumber() {
  return applyDecorators(
    IsNotEmpty(),
    IsInt(),
    Type(() => Number),
  );
}
