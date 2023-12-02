import { IsOptional, IsString, Length } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export function IsOptionalString(min: number, max: number) {
  return applyDecorators(IsOptional(), IsString(), Length(min, max));
}
