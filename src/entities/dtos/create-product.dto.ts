import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { deliveryType } from 'src/types/enums/fee-type.enum';

export class CreateProductDto {
  @ApiProperty({ description: '묶음 배송 그룹 id' })
  @IsOptional()
  bundleId!: number | undefined;

  @ApiProperty({ description: '상품 카테고리 id' })
  @IsNotEmpty()
  categoryId!: number;

  @ApiProperty({ description: '제조 회사 id' })
  @IsNotEmpty()
  companyId!: number;

  @ApiProperty({ description: '구매 가능 여부' })
  @IsNotEmpty()
  isSale!: number;

  @ApiProperty({ description: '상품명' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: '상품 설명', required: false })
  @IsOptional()
  description!: string;

  @ApiProperty({ description: '배송 타입', type: 'enum', enum: deliveryType })
  @IsEnum(deliveryType)
  feeType!: keyof typeof deliveryType;

  @ApiProperty({ description: '무료 배송 기준' })
  @IsOptional()
  deliveryFreeOver!: number;

  @ApiProperty({ description: '배송비' })
  @IsNotEmpty()
  shippingFee!: number;

  @ApiProperty({ description: '상품이미지' })
  @IsNotEmpty()
  img!: string;
}
