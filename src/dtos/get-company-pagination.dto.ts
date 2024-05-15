import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalString } from 'src/decorators/is-optional-string.decorator';
import { GetPaginationDto } from './get-pagination.dto';

export class GetCompanyPaginationDto extends GetPaginationDto {
  /**
   * @todo
   * 검색어 길이 제한 수정
   */
  @ApiProperty({ type: String, description: '회사 검색 키워드', required: false, nullable: true })
  @IsOptionalString(1, 20)
  search?: string | null;
}
