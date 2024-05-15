import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryDto } from 'src/entities/dtos/category.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  async getCategory(skip: number, take: number): Promise<[CategoryDto[], number]> {
    return await this.findAndCount({
      select: {
        id: true,
        name: true,
      },
      order: {
        name: 'ASC',
        id: 'ASC',
      },
      skip,
      take,
    });
  }
}
