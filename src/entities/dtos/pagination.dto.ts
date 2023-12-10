import { IsOptionalNumber } from 'src/decorators/is-optional-number.decorator';

export class PaginationDto {
  @IsOptionalNumber('int')
  page?: number | null;

  @IsOptionalNumber('int')
  limit?: number | null;
}
