import { IsNotEmpty, IsString, Length, MaxLength, MinLength } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsNotEmptyString(min?: number, max?: number) {
  return applyDecorators(IsNotEmpty(), IsString(), ...(min ? [MinLength(min)] : []), ...(max ? [MaxLength(max)] : []));
}
