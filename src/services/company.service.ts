import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { CompanyRepository } from 'src/repositories/company.repository';
import { getOffset } from 'src/util/functions/get-offset.function';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async getCompany(paginationDto: PaginationDto) {
    const { skip, take } = getOffset(paginationDto);
    const [list, count] = await this.companyRepository.findAndCount({
      order: {
        name: 'ASC',
      },
      skip,
      take,
    });
    return { list, count };
  }
}
