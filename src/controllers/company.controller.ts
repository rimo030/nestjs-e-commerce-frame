import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller-jwt.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { GetCompanyDto } from 'src/entities/dtos/get-company.dto';
import { PaginationResponseDto } from 'src/entities/dtos/pagination-response.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { CompanyService } from 'src/services/company.service';
import { createPaginationResponseDto } from 'src/util/functions/create-pagination-response-dto.function';

@Controller('company')
@ApiTags('Company API')
@UseGuards(SellerJwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ summary: '회사 조회 API', description: '등록된 회사를 페이지 네이션으로 확인할 수 있다.' })
  async getCompany(
    @UserId() sellerId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<GetCompanyDto>> {
    const response = await this.companyService.getCompany(sellerId, paginationDto);
    return createPaginationResponseDto(response);
  }
}
