import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryDto } from 'src/entities/dtos/category.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  /**
   * 카테고리를 저장합니다.
   * @param createCategoryDto 저장할 카테고리의 데이터 입니다.
   */
  async saveCategory(createCategoryDto: { name: string }): Promise<{
    id: number;
    name: string;
  }> {
    const category = await this.categoryRepository.save({ name: createCategoryDto.name });
    return { id: category.id, name: category.name };
  }

  /**
   * 카테고리들을 저장합니다.
   * @param createCategoryDtos 저장할 카테고리의 데이터들 입니다.
   */
  async saveCategories(createCategoryDto: { name: string }[]): Promise<{ id: number; name: string }[]> {
    const dtos = createCategoryDto.map((c) => ({ name: c.name }));
    const categorys = await this.categoryRepository.save(dtos);
    return categorys.map((c) => ({ id: c.id, name: c.name }));
  }

  /**
   * 카테고리를 페이지네이션으로 조회합니다.
   * @param skip 건너뛸 요소 개수 입니다.
   * @param take 가져올 요소 개수 입니다.
   */
  async getCategory(skip: number, take: number): Promise<[CategoryDto[], number]> {
    return await this.categoryRepository.findAndCount({
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
