import { IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsOptionalString(min?: number, max?: number) {
  return applyDecorators(IsOptional(), IsString(), ...(min ? [MinLength(min)] : []), ...(max ? [MaxLength(max)] : []));
}
