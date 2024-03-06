import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SellerJwtAuthGuard } from 'src/auth/guards/seller.jwt.guard';
import { CompanyEntity } from 'src/entities/company.entity';
import { GetCompanyDto } from 'src/entities/dtos/get-company.dto';
import { PaginationResponseForm } from 'src/interfaces/pagination-response-form.interface';
import { CompanyService } from 'src/services/company.service';
import { UserId } from 'src/util/decorator/userId.decorator';
import { createResponseForm } from 'src/util/functions/create-response-form.function';
import { PaginationDto } from 'src/util/pagination/pagination.dto';

@Controller('company')
@ApiTags('Company API')
@UseGuards(SellerJwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompany(
    /**
     * @todo
     * sellerId 추후 사용 예정
     */
    // @UserId() sellerId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResponseForm<GetCompanyDto>> {
    const response = await this.companyService.getCompany(paginationDto);
    return createResponseForm(response, paginationDto);
  }
}
