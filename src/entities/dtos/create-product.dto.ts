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
    Pick<
      ProductEntity,
      | 'bundleId'
      | 'categoryId'
      | 'companyId'
      | 'isSale'
      | 'name'
      | 'description'
      | 'deliveryType'
      | 'deliveryCharge'
      | 'img'
    >
{
  @ApiProperty({ type: Number, description: '묶음 배송 그룹 id', required: false, nullable: true, example: 1 })
  @IsOptionalNumber()
  bundleId?: number | null;

  @ApiProperty({ type: Number, description: '상품 카테고리 id', required: true, example: 1 })
  @IsNotEmptyNumber()
  categoryId!: number;

  @ApiProperty({ type: Number, description: '제조 회사 id', required: true, example: 1 })
  @IsNotEmptyNumber()
  companyId!: number;

  @ApiProperty({ type: Boolean, description: '구매 가능 여부', required: true, example: true })
  @IsNotEmptyBoolean()
  isSale!: boolean;

  @ApiProperty({ type: String, description: '상품명', required: true, example: 'test product' })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({
    type: String,
    description: '상품 설명',
    required: false,
    nullable: true,
    example: '테스트 상품 입니다!',
  })
  @IsOptionalString(1, 128)
  description?: string | null;

  @ApiProperty({
    type: 'enum',
    enum: deliveryType,
    description: '배송비 종류 ("FREE", "NOT_FREE", "COUNT_FREE", "PRICE_FREE" 을 허용합니다.)',
    required: true,
  })
  @IsEnum(deliveryType)
  deliveryType!: keyof typeof deliveryType;

  @ApiProperty({
    type: Number,
    description: '무료 배송 기준 (deliveryType이 FREE | NOT_FREE 라면 null을 허용합니다.)',
    required: false,
    nullable: true,
    example: null,
  })
  @IsOptionalNumber()
  deliveryFreeOver?: number | null;

  @ApiProperty({
    type: Number,
    description: '배송비 (무료배송(FREE)이라면 0원이 입력되어야 합니다.)',
    required: true,
    example: 0,
  })
  @IsNotEmptyNumber()
  deliveryCharge!: number;

  /**
   * @todo
   * 확장 예정
   */
  @ApiProperty({ type: String, description: '상품이미지', required: true, example: 'test.img' })
  @IsNotEmptyString(1, 128)
  img!: string;
}
