import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { CompanyController } from 'src/controllers/company.controller';
import { CompanyRepository } from 'src/repositories/company.repository';
import { CompanyService } from 'src/services/company.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([CompanyRepository])],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
