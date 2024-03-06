import { PickType } from '@nestjs/swagger';
import { ProductInputOptionEntity } from 'src/entities/product-input-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';

export class GetProductRequiredOptionDto extends PickType(ProductRequiredOptionEntity, [
  'id',
  'productId',
  'name',
  'price',
  'isSale',
] as const) {
  productInputOptions!: Pick<
    ProductInputOptionEntity,
    'id' | 'productRequiredOptionId' | 'name' | 'value' | 'description' | 'isRequired'
  >[];
}
