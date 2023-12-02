import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsOptionalNumber() {
  return applyDecorators(
    IsOptional(),
    IsInt(),
    Type(() => Number),
  );
}
