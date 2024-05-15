import { Cart } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { CreateCartOptionDto } from './create-cart-option.dto';
import { CreateCartRequiredOptionDto } from './create-cart-required-option.dto';

export class CreateCartDto implements Pick<Cart, 'productId'> {
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
  @ValidateNested({ each: true })
  @Type(() => CreateCartRequiredOptionDto)
  createCartRequiredOptionDtos!: CreateCartRequiredOptionDto[];

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
  @ValidateNested({ each: true })
  @Type(() => CreateCartOptionDto)
  createCartOptionDtos!: CreateCartOptionDto[];
}
