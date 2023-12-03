import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from 'src/decorators/is-optional-number.decorator';
import { IsOptionalString } from 'src/decorators/is-optional-string.decorator';

export class GetProductDto {
  @ApiProperty({ description: '현재 페이지', required: false })
  @IsOptionalNumber()
  page: number = 1;

  @ApiProperty({ description: '페이지 당 상품 개수', required: false })
  @IsOptionalNumber()
  limit: number = 15;

  /**
   * @todo
   * 검색어 길이 제한 결정
   */
  @ApiProperty({ description: '검색 키워드', required: false })
  @IsOptionalString(1, 20)
  search?: string;

  @ApiProperty({ description: '카테고리 id', required: false })
  @IsOptionalNumber()
  categoryId?: number;

  @ApiProperty({ description: '판매자 id', required: false })
  @IsOptionalNumber()
  sellerId?: number;
}
