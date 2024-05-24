import { IntersectionType, PartialType } from '@nestjs/swagger';
import { CreateProductOptionsDto } from './create-product-options.dto';
import { GetPaginationDto } from './get-pagination.dto';

export class GetProductOptionsPaginationDto extends IntersectionType(
  PartialType(CreateProductOptionsDto),
  GetPaginationDto,
) {}
