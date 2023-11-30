import { Repository } from 'typeorm';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductRequiredOptionEntity)
export class ProductsRequiredRespository extends Repository<ProductRequiredOptionEntity> {}
