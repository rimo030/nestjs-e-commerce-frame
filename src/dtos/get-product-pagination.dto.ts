import { ApiProperty, IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptionalNullableNumber } from 'src/decorators/is-optional-nullable-number.decorator';
import { IsOptionalNullableString } from 'src/decorators/is-optional-nullable-string.decorator';
import { CreateProductDto } from './create-product.dto';
import { GetPaginationDto } from './get-pagination.dto';

export class GetProductPaginationDto extends IntersectionType(
  PartialType(OmitType(CreateProductDto, ['bundleId', 'description', 'deliveryFreeOver', 'img'])),
  GetPaginationDto,
) {
  @ApiProperty({
    type: String,
    description: `묶음 배송 그룹 id (숫자와 'null' 입력을 허용합니다.)`,
    required: false,
    nullable: true,
    example: null,
  })
  @IsOptionalNullableNumber()
  bundleId?: number | null;

  @ApiProperty({
    type: String,
    description: '상품 설명 (null을 허용합니다.)',
    required: false,
    nullable: true,
    example: '테스트 상품 입니다!',
  })
  @IsOptionalNullableString(1, 128)
  description?: string | null;

  @ApiProperty({
    type: String,
    description: `무료 배송 기준 number | null (deliveryType이 FREE | NOT_FREE라면 'null'을 허용합니다.)`,
    required: false,
    nullable: true,
    example: null,
  })
  @IsOptionalNullableNumber()
  deliveryFreeOver?: number | null;
}
