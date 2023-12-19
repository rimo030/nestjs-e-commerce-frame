import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { ProductRequiredOptionEntity } from '../product-required-option.entity';
import { CreateProductOptionsDto } from './create-product-options.dto';

export class GetProductOptionsDto
  extends PickType(CreateProductOptionsDto, ['name', 'price', 'isSale'] as const)
  implements Pick<ProductRequiredOptionEntity, 'id' | 'productId'>
{
  @ApiProperty({ description: '필수옵션 Id' })
  @IsNotEmptyNumber('int')
  id!: number;

  @ApiProperty({ description: '상품 Id' })
  @IsNotEmptyNumber('int')
  productId!: number;
}
