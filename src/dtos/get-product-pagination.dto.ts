import { IntersectionType, OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { GetPaginationDto } from './get-pagination.dto';

export class GetProductPaginationDto extends IntersectionType(
  PartialType(OmitType(CreateProductDto, ['img'])),
  GetPaginationDto,
) {}
