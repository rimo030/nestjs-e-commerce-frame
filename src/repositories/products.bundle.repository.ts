import { Repository } from 'typeorm';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductBundleEntity)
export class ProductsBundleRespository extends Repository<ProductBundleEntity> {}
