import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { GetCompanyDto } from 'src/entities/dtos/get-company.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {
  async getCompany(skip: number, take: number): Promise<[GetCompanyDto[], number]> {
    return await this.findAndCount({
      order: {
        name: 'ASC',
        id: 'ASC',
      },
      skip,
      take,
    });
  }
}
