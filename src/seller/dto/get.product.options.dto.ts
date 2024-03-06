import { PickType } from '@nestjs/swagger';
import { ProductOptionEntity } from 'src/entities/product-option.entity';

export class GetProductOptionDto extends PickType(ProductOptionEntity, [
  'id',
  'productId',
  'name',
  'price',
  'isSale',
] as const) {}
