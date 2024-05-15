import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompanyDto } from 'src/entities/dtos/company.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {
  async getCompany(skip: number, take: number): Promise<[CompanyDto[], number]> {
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
