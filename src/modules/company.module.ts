import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from 'src/controllers/company.controller';
import { CompanyEntity } from 'src/entities/company.entity';
import { SellerEntity } from 'src/entities/seller.entity';
import { CompanyRepository } from 'src/repositories/company.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { CompanyService } from 'src/services/company.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, SellerEntity])],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyRepository, SellerRepository],
})
export class CompanyModule {}
