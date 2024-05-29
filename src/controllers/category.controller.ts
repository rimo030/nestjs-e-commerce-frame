import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoryDto } from 'src/dtos/category.dto';
import { CreateCategoryDto } from 'src/dtos/create-category.dto';
import { GetPaginationDto } from 'src/dtos/get-pagination.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CategoryService } from 'src/services/category.service';
import { createPaginationResponseDto } from 'src/util/functions/pagination-util.function';

@Controller('category')
@ApiTags('Categry API')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: '카테고리 조회 API', description: '등록된 카테고리를 페이지네이션으로 조회할 수 있다.' })
  async getCategory(@Query() paginationDto: GetPaginationDto): Promise<PaginationDto<CategoryDto>> {
    const paginationResponse = await this.categoryService.getCategory(paginationDto);
    return createPaginationResponseDto(paginationResponse);
  }

  @HttpCode(201)
  @Post()
  @ApiOperation({ summary: '카테고리 등록 API', description: '카테고리를 등록할 수 있다.' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<{
    data: CategoryDto;
  }> {
    const category = await this.categoryService.createCategory(createCategoryDto);
    return { data: category };
  }

  @HttpCode(201)
  @Post('bulk')
  @ApiOperation({ summary: '카테고리 다수 등록 API', description: '다수의 카테고리를 등록할 수 있다.' })
  async createCategories(@Body() createCategoryDtos: CreateCategoryDto[]): Promise<{
    data: CategoryDto[];
  }> {
    const categories = await this.categoryService.createCategories(createCategoryDtos);
    return { data: categories };
  }
}
