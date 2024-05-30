import { Body, Controller, Get, HttpCode, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CompanyDto } from 'src/dtos/company.dto';
import { CreateCompanyDto } from 'src/dtos/create-company.dto';
import { GetCompanyPaginationDto } from 'src/dtos/get-company-pagination.dto';
import { PaginationDto } from 'src/dtos/pagination.dto';
import { CompanyService } from 'src/services/company.service';
import { createPaginationResponseDto } from 'src/util/functions/pagination-util.function';

@Controller('company')
@ApiBearerAuth('token')
@ApiTags('Company API')
@UseGuards(SellerJwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @HttpCode(201)
  @Post('bulk')
  @ApiBody({ type: [CreateCompanyDto] })
  @ApiOperation({ summary: '회사 다수 등록 API', description: '회사를 여러개 등록할 수 있다.' })
  async createCompanies(
    @UserId() sellerId: number,
    @Body() createCompanyDtos: CreateCompanyDto[],
  ): Promise<{
    data: CompanyDto[];
  }> {
    const companies = await this.companyService.createCompanies(sellerId, createCompanyDtos);
    return { data: companies };
  }

  @HttpCode(201)
  @Post()
  @ApiOperation({ summary: '회사 등록 API', description: '회사를 등록할 수 있다.' })
  async createCompany(
    @UserId() sellerId: number,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<{
    data: CompanyDto;
  }> {
    const company = await this.companyService.createCompany(sellerId, createCompanyDto);
    return { data: company };
  }

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
