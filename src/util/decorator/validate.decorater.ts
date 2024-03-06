import { Type, Transform } from 'class-transformer';
import { IsNotEmpty, IsBoolean, IsInt, IsNumber, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

/**
 * IsNotEmpty...
 *
 */

export function IsNotEmptyBoolean() {
  return applyDecorators(IsNotEmpty(), ParseOptionalBoolean(), IsBoolean());
}

export function IsNotEmptyNumber(type: 'number' | 'int' = 'number') {
  return applyDecorators(
    IsNotEmpty(),
    type === 'int' ? IsInt() : IsNumber(),
    Type(() => Number),
  );
}

export function IsNotEmptyString(min?: number, max?: number) {
  return applyDecorators(IsNotEmpty(), IsString(), ...(min ? [MinLength(min)] : []), ...(max ? [MaxLength(max)] : []));
}

/**
 * IsOptional...
 *
 */
const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
]);

export const ParseOptionalBoolean = () =>
  Transform((params) => {
    return optionalBooleanMapper.get(String(params.value));
  });

export function IsOptionalBoolean() {
  return applyDecorators(IsOptional(), ParseOptionalBoolean(), IsBoolean());
}

export function IsOptionalNumber(type: 'number' | 'int' = 'number') {
  return applyDecorators(
    IsOptional(),
    type === 'int' ? IsInt() : IsNumber(),
    Type(() => Number),
  );
}

export function IsOptionalString(min?: number, max?: number) {
  return applyDecorators(IsOptional(), IsString(), ...(min ? [MinLength(min)] : []), ...(max ? [MaxLength(max)] : []));
}
