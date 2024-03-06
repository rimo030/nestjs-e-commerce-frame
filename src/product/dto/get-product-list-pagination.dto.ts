import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalString, IsOptionalNumber } from 'src/util/decorator/validate.decorater';
import { PaginationDto } from '../../util/pagination/pagination.dto';

export class GetProductListPaginationDto extends PaginationDto {
  /**
   * @todo
   * 검색어 길이 제한 결정
   */
  @ApiProperty({ type: String, description: '검색 키워드', required: false, nullable: true })
  @IsOptionalString(1, 20)
  search?: string | null;

  @ApiProperty({ type: Number, description: '카테고리 id', required: false, nullable: true })
  @IsOptionalNumber()
  categoryId?: number | null;

  @ApiProperty({ type: Number, description: '판매자 id', required: false, nullable: true })
  @IsOptionalNumber()
  sellerId?: number | null;
}
