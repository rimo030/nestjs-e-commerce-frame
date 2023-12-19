import { IsEnum } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmptyBoolean } from 'src/decorators/is-not-empty-boolean.decorator';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { IsOptionalNumber } from 'src/decorators/is-optional-number.decorator';
import { IsOptionalString } from 'src/decorators/is-optional-string.decorator';
import { deliveryType } from 'src/types/enums/fee-type.enum';
import { ProductEntity } from '../product.entity';
import { CreateProductDto } from './create-product.dto';

export class GetProductDto
  extends PickType(CreateProductDto, [
    'categoryId',
    'companyId',
    'isSale',
    'name',
    'deliveryType',
    'deliveryCharge',
    'img',
  ] as const)
  implements Pick<ProductEntity, 'id'>
{
  @ApiProperty({ description: '상품 Id' })
  @IsNotEmptyNumber('int')
  id!: number;
}
