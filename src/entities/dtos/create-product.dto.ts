import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyBoolean } from 'src/decorators/is-not-empty-boolean.decorator';
import { IsNotEmptyNumber } from 'src/decorators/is-not-empty-number.decorator';
import { IsNotEmptyString } from 'src/decorators/is-not-empty-string.decorator';
import { IsOptionalNumber } from 'src/decorators/is-optional-number.decorator';
import { IsOptionalString } from 'src/decorators/is-optional-string.decorator';
import { deliveryType } from 'src/types/enums/fee-type.enum';
import { ProductEntity } from '../product.entity';

export class CreateProductDto
  implements
    Partial<ProductEntity>,
    Pick<ProductEntity, 'categoryId' | 'companyId' | 'isSale' | 'name' | 'deliveryType' | 'deliveryCharge' | 'img'>
{
  @ApiProperty({ description: '묶음 배송 그룹 id' })
  @IsOptionalNumber()
  bundleId?: number;

  @ApiProperty({ description: '상품 카테고리 id' })
  @IsNotEmptyNumber()
  categoryId!: number;

  @ApiProperty({ description: '제조 회사 id' })
  @IsNotEmptyNumber()
  companyId!: number;

  @ApiProperty({ description: '구매 가능 여부' })
  @IsNotEmptyBoolean()
  isSale!: boolean;

  @ApiProperty({ description: '상품명' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ description: '상품 설명', required: false })
  @IsOptionalString(1, 128)
  description?: string | null;

  @ApiProperty({ description: '배송 타입', type: 'enum', enum: deliveryType })
  @IsEnum(deliveryType)
  deliveryType!: keyof typeof deliveryType;

  /**
   * deliveryType이 FREE | NOT_FREE 라면 null
   */
  @ApiProperty({ description: '무료 배송 기준' })
  @IsOptionalNumber()
  deliveryFreeOver?: number | null;

  @ApiProperty({ description: '배송비' })
  @IsNotEmptyNumber()
  deliveryCharge!: number;

  /**
   * @todo
   * 확장 예정
   */
  @ApiProperty({ description: '상품이미지' })
  @IsNotEmptyString(1, 128)
  img!: string;
}
