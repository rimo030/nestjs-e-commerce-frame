import { Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/entities/dtos/category.dto';
import { GetPaginationDto } from 'src/entities/dtos/get-pagination.dto';
import { PaginationResponse } from 'src/interfaces/pagination-response.interface';
import { CategoryRepository } from 'src/repositories/category.repository';
import { getOffset } from 'src/util/functions/pagination-util.function';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  /**
   * 카테고리를 저장합니다.
   * @param createCategoryDto 저장할 카테고리의 이름이 저장된 객체 입니다.
   */
  async createCategory(createCategoryDto: { name: string }): Promise<{
    id: number;
    name: string;
  }> {
    const category = await this.categoryRepository.saveCategory(createCategoryDto);
    return category;
  }

  /**
   * 카테고리들을 저장합니다.
   * @param createCategoryDtos 저장할 카테고리의 이름을 담은 배열 입니다.
   */
  async createCategories(createCategoryDtos: { name: string }[]): Promise<{ id: number; name: string }[]> {
    const savedCategories = await this.categoryRepository.saveCategories(createCategoryDtos);
    return savedCategories;
  }

  /**
   * 카테고리를 페이지 네이션으로 조회합니다.
   * @param paginationDto 페이지네이션 요청 객체 입니다.
   */
  async getCategory(getPaginationDto: GetPaginationDto): Promise<PaginationResponse<CategoryDto>> {
    const { skip, take } = getOffset(getPaginationDto);
    const [data, count] = await this.categoryRepository.getCategory(skip, take);
    return { data, skip, count, take };
  }
}
