import { PickType } from '@nestjs/swagger';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';

export class GetProductBundleDto extends PickType(ProductBundleEntity, ['id', 'name', 'chargeStandard']) {}
