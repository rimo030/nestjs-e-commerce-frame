import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

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
