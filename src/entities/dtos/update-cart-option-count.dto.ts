import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { CartOptionType } from 'src/types/cart-option-type';
import { CartEntity } from '../cart.entity';
import { CartOptionDto } from './cart-option.dto';

export class UpdateCartOptionCountDto
  implements Pick<CartEntity, 'id'>, Pick<CartOptionDto, 'cartId' | 'id' | 'count'>
{
  @ApiProperty({
    type: String,
    description: '옵션의 종류를 입력합니다. (option / requiredOption)',
    required: true,
    example: 'requiredOption',
  })
  @IsNotEmptyString()
  cartOptionType!: CartOptionType;

  @ApiProperty({ type: Number, description: '상품 옵션의 id', required: true, example: 1 })
  @IsNotEmptyNumber()
  id!: number;

  @ApiProperty({ type: Number, description: '장바구니의 id', required: true, example: 1 })
  @IsNotEmptyNumber()
  cartId!: number;

  @ApiProperty({ type: Number, description: '상품 옵션의 수량', required: true, example: 1 })
  @IsNotEmptyNumber('int', { min: 1 })
  count!: number;
}
