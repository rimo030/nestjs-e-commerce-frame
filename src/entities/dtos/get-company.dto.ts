import { PickType } from '@nestjs/swagger';
import { CompanyEntity } from '../company.entity';

export class GetCompanyDto extends PickType(CompanyEntity, ['id', 'name']) {}
