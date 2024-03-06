import { Injectable } from '@nestjs/common';
import { GetCategoryDto } from 'src/entities/dtos/get-category.dto';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { CategoryRepository } from 'src/repositories/category.repository';
import { getOffset } from 'src/util/functions/get-offset.function';
import { PaginationDto } from 'src/util/pagination/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategory(paginationDto: PaginationDto): Promise<GetResponse<GetCategoryDto>> {
    const { skip, take } = getOffset(paginationDto);
    const [list, count] = await this.categoryRepository.getCategory(skip, take);
    return { list, count, take };
  }
}
