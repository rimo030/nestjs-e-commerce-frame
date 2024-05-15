import { Module } from '@nestjs/common';
import { CompanyController } from 'src/controllers/company.controller';
import { CompanyService } from 'src/services/company.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
