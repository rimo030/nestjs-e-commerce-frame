import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {}
