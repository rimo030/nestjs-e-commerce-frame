import { CartRequiredOption } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';

export class CreateCartRequiredOptionDto implements Pick<CartRequiredOption, 'productRequiredOptionId' | 'count'> {
  @ApiProperty({ type: Number, description: '상품 필수 옵션의 id', required: true, example: 1 })
  @IsNotEmptyNumber()
  productRequiredOptionId!: number;

  @ApiProperty({ type: Number, description: '개수', required: true, example: 1 })
  @IsNotEmptyNumber('int', { min: 1 })
  count!: number;
}
