import { Transform } from 'class-transformer';
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsOptionalNullableString(min?: number, max?: number) {
  return applyDecorators(
    IsOptional(),
    ...(min ? [MinLength(min)] : []),
    ...(max ? [MaxLength(max)] : []),
    Transform(({ value }) => (value === 'null' ? null : value)),
    IsString(),
  );
}
