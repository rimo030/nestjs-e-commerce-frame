import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { GetCategoryDto } from 'src/entities/dtos/get-category.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  async getCategory(skip: number, take: number): Promise<[GetCategoryDto[], number]> {
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
