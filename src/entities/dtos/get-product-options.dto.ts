import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyBoolean } from 'src/decorators/is-not-empty-boolean.decorator';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { ProductRequiredOptionEntity } from '../product-required-option.entity';

export class GetProductOptionsDto
  implements Pick<ProductRequiredOptionEntity, 'id' | 'productId' | 'name' | 'price' | 'isSale'>
{
  @ApiProperty({ description: '필수옵션 Id' })
  @IsNotEmptyNumber('int')
  id!: number;

  @ApiProperty({ description: '상품 Id' })
  @IsNotEmptyNumber('int')
  productId!: number;

  @ApiProperty({ description: '옵션 이름' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ description: '가격' })
  @IsNotEmptyNumber()
  price!: number;

  @ApiProperty({ description: '구매 가능 여부' })
  @IsNotEmptyBoolean()
  isSale!: boolean;
}
