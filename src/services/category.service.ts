import { Injectable } from '@nestjs/common';
import { GetCategoryDto } from 'src/entities/dtos/get-category.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { getOffset } from 'src/util/functions/get-offset.function';
import { PrismaService } from './prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategory(paginationDto: PaginationDto): Promise<GetResponse<GetCategoryDto>> {
    const { skip, take } = getOffset(paginationDto);

    const data = await this.prisma.category.findMany({
      select: { id: true, name: true },
      skip,
      take,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });

    const count = await this.prisma.category.count();

    return { data, skip, count, take };
  }
}
