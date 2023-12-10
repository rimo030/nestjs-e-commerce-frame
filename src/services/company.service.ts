import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { CompanyRepository } from 'src/repositories/company.repository';
import { getOffset } from 'src/util/functions/get-offset.function';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async getCompany(paginationDto: PaginationDto): Promise<GetResponse<CompanyEntity>> {
    const { skip, take } = getOffset(paginationDto);
    const [list, count] = await this.companyRepository.findAndCount({
      order: {
        name: 'ASC',
        id: 'ASC',
      },
      skip,
      take,
    });
    return { list, count, take };
  }
}
