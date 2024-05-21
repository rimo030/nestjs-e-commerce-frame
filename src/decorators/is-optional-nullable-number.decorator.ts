import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { HttpException, HttpStatus, applyDecorators } from '@nestjs/common';

export function IsOptionalNullableNumber() {
  return applyDecorators(
    IsOptional(),
    Transform(({ value }) => {
      if (value === 'null' || value === null) {
        return null;
      }
      const parsedValue = Number(value);
      if (isNaN(parsedValue)) {
        throw new HttpException(`${value} is not a valid number`, HttpStatus.BAD_REQUEST);
      }
      return parsedValue;
    }),
    IsNumber(),
  );
}
