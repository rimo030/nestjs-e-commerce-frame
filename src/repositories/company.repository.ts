import { Repository } from 'typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {}
