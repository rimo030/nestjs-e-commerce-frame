import { PickType } from '@nestjs/swagger';
import { ProductBundleEntity } from '../product-bundle.entity';

export class GetProductBundleDto extends PickType(ProductBundleEntity, ['id', 'name', 'chargeStandard']) {}
