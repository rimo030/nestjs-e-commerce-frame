import { PickType } from '@nestjs/swagger';
import { ProductEntity } from 'src/entities/product.entity';

export class GetProductDto extends PickType(ProductEntity, [
  'id',
  'sellerId',
  'bundleId',
  'categoryId',
  'companyId',
  'isSale',
  'name',
  'deliveryType',
  'deliveryCharge',
  'img',
] as const) {}
