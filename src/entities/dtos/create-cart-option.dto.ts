import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { CartOptionEntity } from '../cart-option.entity';

export class CreateCartOptionDto implements Pick<CartOptionEntity, 'productOptionId' | 'count'> {
  @ApiProperty({ type: Number, description: '상품 선택 옵션의 id', required: true, example: 1 })
  @IsNotEmptyNumber()
  productOptionId!: number;

  @ApiProperty({ type: Number, description: '개수', required: true, example: 1 })
  @IsNotEmptyNumber()
  count!: number;
}
