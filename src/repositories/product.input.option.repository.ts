import { Repository } from 'typeorm';
import { ProductInputOptionEntity } from 'src/entities/product-input-option.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductInputOptionEntity)
export class ProductInputOptionRepository extends Repository<ProductInputOptionEntity> {}
