import { Injectable } from '@nestjs/common';
import { CategoryEntity } from 'src/entities/category.entity';
import { CategoryRepository } from 'src/repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getCategory(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }
}
