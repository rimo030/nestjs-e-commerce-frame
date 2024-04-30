import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { GetCompanyDto } from 'src/entities/dtos/get-company.dto';
import { PaginationResponseDto } from 'src/entities/dtos/pagination-response.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { CompanyService } from 'src/services/company.service';
import { createProductPaginationForm } from 'src/util/functions/create-product-pagination-form.function';

@Controller('company')
@ApiTags('Company API')
@UseGuards(SellerJwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompany(
    @UserId() sellerId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<GetCompanyDto>> {
    const response = await this.companyService.getCompany(sellerId, paginationDto);
    return createProductPaginationForm(response);
  }
}
