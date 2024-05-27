import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { order } from 'src/types/order-by.type';
import { CreateProductOptionsDto } from './create-product-options.dto';
import { GetPaginationDto } from './get-pagination.dto';

export class GetProductOptionsPaginationDto extends IntersectionType(
  PartialType(CreateProductOptionsDto),
  GetPaginationDto,
) {
  @ApiProperty({
    type: 'enum',
    enum: ['asc', 'desc'],
    description: '가격 정렬 조건',
    required: false,
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  priceOrder?: order;
}
