import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { CartEntity } from '../cart.entity';
import { CreateCartOptionDto } from './create-cart-option.dto';
import { CreateCartRequiredOptionDto } from './create-cart-required-option.dto';

export class CreateCartDto implements Pick<CartEntity, 'productId'> {
  @ApiProperty({ type: Number, description: '상품의 id', required: true, example: 1 })
  @IsNotEmptyNumber()
  productId!: number;

  @ApiProperty({
    type: CreateCartRequiredOptionDto,
    description: '장바구니에 담길 필수옵션의 정보',
    required: true,
    example: [
      { productRequiredOptionId: 1, count: 2 },
      { productRequiredOptionId: 2, count: 1 },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => CreateCartRequiredOptionDto)
  cartRequiredOptions!: CreateCartRequiredOptionDto[];

  @ApiProperty({
    type: CreateCartOptionDto,
    description: '장바구니에 담길 선택옵션의 정보',
    required: false,
    example: [
      { productOptionId: 1, count: 2 },
      { productOptionId: 2, count: 1 },
    ],
  })
  @IsArray()
  @Type(() => CreateCartOptionDto)
  cartOptions!: CreateCartOptionDto[] | [];
}
