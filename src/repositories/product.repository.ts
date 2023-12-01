import { Repository } from 'typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {}
