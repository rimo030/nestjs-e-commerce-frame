import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetCompanyDto } from 'src/entities/dtos/get-company.dto';
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

  async getCompany(paginationDto: PaginationDto): Promise<GetResponse<GetCompanyDto>> {
    const { skip, take } = getOffset(paginationDto);
    const [list, count] = await this.companyRepository.getCompany(skip, take);
    return { list, count, take };
  }
}
