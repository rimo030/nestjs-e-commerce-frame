import { IsBoolean, IsNotEmpty } from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { ParseOptionalBoolean } from './is-optional-boolean.decorator';

export function IsNotEmptyBoolean() {
  return applyDecorators(IsNotEmpty(), ParseOptionalBoolean(), IsBoolean());
}
