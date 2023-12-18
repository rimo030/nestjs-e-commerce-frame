import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from 'src/decorators/is-optional-number.decorator';

export class PaginationDto {
  @IsOptionalNumber('int')
  @ApiProperty({ description: '조회할 페이지', required: false, nullable: true })
  page?: number;

  @IsOptionalNumber('int')
  @ApiProperty({ description: '한 페이지에 나오는 요소의 수', required: false, nullable: true })
  limit?: number;
}
