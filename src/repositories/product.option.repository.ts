import { Repository } from 'typeorm';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductOptionEntity)
export class ProductOptionRepository extends Repository<ProductOptionEntity> {}
