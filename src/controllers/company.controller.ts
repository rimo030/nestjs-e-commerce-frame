import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller.jwt.guard';
import { UserId } from 'src/auth/user-id.decorator';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { CompanyService } from 'src/services/company.service';

@Controller('company')
@ApiTags('Company API')
@UseGuards(SellerJwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompany(@UserId() sellerId: number, @Query() paginationDto: PaginationDto) {
    const response = await this.companyService.getCompany(paginationDto);
  }
}
