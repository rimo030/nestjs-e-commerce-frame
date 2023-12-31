import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryEntity } from 'src/entities/category.entity';
import { GetCategoryDto } from 'src/entities/dtos/get-category.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { PaginationResponseForm } from 'src/interfaces/pagination-response-form.interface';
import { CategoryService } from 'src/services/category.service';
import { createResponseForm } from 'src/util/functions/create-response-form.function';

@Controller('category')
@ApiTags('Categry API')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '카테고리 조회 API', description: '등록된 카테고리를 확인할 수 있다.' })
  async getCategory(@Query() paginationDto: PaginationDto): Promise<PaginationResponseForm<GetCategoryDto>> {
    const response = await this.categoryService.getCategory(paginationDto);
    return createResponseForm(response, paginationDto);
  }
}
