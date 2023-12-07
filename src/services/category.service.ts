import { Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/entities/category.entity';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { PaginationResponseForm } from 'src/interfaces/pagination-response-form.interface';
import { CategoryRepository } from 'src/repositories/category.repository';
import { getOffset } from 'src/util/functions/get-offset.function';

@Injectable()
export class CategoryService {
  companyRepository: any;
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategory(paginationDto: PaginationDto) {
    const { skip, take } = getOffset(paginationDto);
    const [list, count] = await this.categoryRepository.findAndCount({
      order: {
        name: 'ASC',
        id: 'ASC',
      },
      skip,
      take,
    });
    return { list, count };
  }
}
