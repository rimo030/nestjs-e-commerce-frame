import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from 'src/entities/product.entity';
import { deliveryType } from 'src/types/enums/fee-type.enum';
import {
  IsOptionalNumber,
  IsNotEmptyNumber,
  IsNotEmptyBoolean,
  IsNotEmptyString,
  IsOptionalString,
} from 'src/util/decorator/validate.decorater';

export class CreateProductDto
  implements
    Partial<ProductEntity>,
    Pick<ProductEntity, 'categoryId' | 'companyId' | 'isSale' | 'name' | 'deliveryType' | 'deliveryCharge' | 'img'>
{
  @ApiProperty({ type: Number, description: '묶음 배송 그룹 id', required: false, nullable: true })
  @IsOptionalNumber()
  bundleId?: number | null;

  @ApiProperty({ type: Number, description: '상품 카테고리 id', required: true })
  @IsNotEmptyNumber()
  categoryId!: number;

  @ApiProperty({ type: Number, description: '제조 회사 id', required: true })
  @IsNotEmptyNumber()
  companyId!: number;

  @ApiProperty({ type: Boolean, description: '구매 가능 여부', required: true })
  @IsNotEmptyBoolean()
  isSale!: boolean;

  @ApiProperty({ type: String, description: '상품명', required: true })
  @IsNotEmptyString(1, 128)
  name!: string;

  @ApiProperty({ type: String, description: '상품 설명', required: false, nullable: true })
  @IsOptionalString(1, 128)
  description?: string | null;

  @ApiProperty({ type: 'enum', enum: deliveryType, description: '배송 타입', required: true })
  @IsEnum(deliveryType)
  deliveryType!: keyof typeof deliveryType;

  /**
   * deliveryType이 FREE | NOT_FREE 라면 null
   */
  @ApiProperty({ type: Number, description: '무료 배송 기준', required: false, nullable: true })
  @IsOptionalNumber()
  deliveryFreeOver?: number | null;

  @ApiProperty({ type: Number, description: '배송비', required: true })
  @IsNotEmptyNumber()
  deliveryCharge!: number;

  /**
   * @todo
   * 확장 예정
   */
  @ApiProperty({ type: String, description: '상품이미지', required: true })
  @IsNotEmptyString(1, 128)
  img!: string;
}
