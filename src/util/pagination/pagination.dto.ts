import { ApiProperty } from '@nestjs/swagger';
import { IsOptionalNumber } from 'src/util/decorator/validate.decorater';

export class PaginationDto {
  @IsOptionalNumber('int')
  @ApiProperty({ type: Number, description: '조회할 페이지', required: false, nullable: true })
  page?: number | null;

  @IsOptionalNumber('int')
  @ApiProperty({ type: Number, description: '한 페이지에 나오는 요소의 수', required: false, nullable: true })
  limit?: number | null;
}
