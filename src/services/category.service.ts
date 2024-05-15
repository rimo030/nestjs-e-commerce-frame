import { Injectable } from '@nestjs/common';
import { CategoryDto } from 'src/dtos/category.dto';
import { GetPaginationDto } from 'src/dtos/get-pagination.dto';
import { PaginationResponse } from 'src/interfaces/pagination-response.interface';
import { getOffset } from 'src/util/functions/pagination-util.function';
import { PrismaService } from './prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 카테고리를 저장합니다.
   * @param createCategoryDto 저장할 카테고리의 이름이 저장된 객체 입니다.
   */
  async createCategory(createCategoryDto: { name: string }): Promise<{
    id: number;
    name: string;
  }> {
    const category = await this.prisma.category.create({
      select: { id: true, name: true },
      data: { name: createCategoryDto.name },
    });
    return category;
  }

  /**
   * 카테고리들을 저장합니다.
   * @param createCategoryDto 저장할 카테고리의 이름을 담은 배열 입니다.
   */
  async createCategories(createCategoryDtos: { name: string }[]): Promise<{ id: number; name: string }[]> {
    const savedCategories = await this.prisma.$transaction(
      createCategoryDtos.map((c) =>
        this.prisma.category.create({
          select: { id: true, name: true },
          data: { name: c.name },
        }),
      ),
    );
    return savedCategories;
  }

  /**
   * 카테고리를 페이지 네이션으로 조회합니다.
   * @param paginationDto 페이지네이션 요청 객체 입니다.
   */
  async getCategory(paginationDto: GetPaginationDto): Promise<PaginationResponse<CategoryDto>> {
    const { skip, take } = getOffset(paginationDto);

    const [data, count] = await Promise.all([
      await this.prisma.category.findMany({
        select: { id: true, name: true },
        skip,
        take,
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
      }),
      await this.prisma.category.count(),
    ]);

    return { data, skip, count, take };
  }
}
