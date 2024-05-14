import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CompanyDto } from 'src/entities/dtos/company.dto';
import { GetCompanyPaginationDto } from 'src/entities/dtos/get-company-pagination.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { CompanyService } from 'src/services/company.service';
import { createPaginationResponseDto } from 'src/util/functions/pagination-util.function';

@Controller('company')
@ApiTags('Company API')
@UseGuards(SellerJwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: '회사 조회 API', description: '등록된 회사를 페이지네이션으로 확인할 수 있다.' })
  async getCompany(
    @UserId() sellerId: number,
    @Query() getCompanyPaginationDto: GetCompanyPaginationDto,
  ): Promise<PaginationDto<CompanyDto>> {
    const paginationResponse = await this.companyService.getCompany(sellerId, getCompanyPaginationDto);
    return createPaginationResponseDto(paginationResponse);
  }
}
