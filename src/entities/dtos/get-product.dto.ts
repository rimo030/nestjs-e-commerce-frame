import { PickType } from '@nestjs/swagger';
import { ProductEntity } from '../product.entity';

export class GetProductDto extends PickType(ProductEntity, [
  'id',
  'sellerId',
  'categoryId',
  'companyId',
  'isSale',
  'name',
  'deliveryType',
  'deliveryCharge',
  'img',
] as const) {}
