import { Injectable } from '@nestjs/common';
import { CompanyDto } from 'src/dtos/company.dto';
import { GetCompanyPaginationDto } from 'src/dtos/get-company-pagination.dto';
import { SellerNotFoundException } from 'src/exceptions/auth.exception';
import { PaginationResponse } from 'src/interfaces/pagination-response.interface';
import { getOffset } from 'src/util/functions/pagination-util.function';
import { PrismaService } from './prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 회사를 생성합니다.
   * @param sellerId 판매자 아이디가 존재해야 회사를 생성할 수 있습니다.
   * @param createCompanyDto 생성할 회사의 정보입니다.
   */
  async createCompany(sellerId: number, createCompanyDto: { name: string }): Promise<{ id: number; name: string }> {
    const seller = await this.prisma.seller.findUnique({
      select: { id: true },
      where: { id: sellerId },
    });
    if (!seller) {
      throw new SellerNotFoundException();
    }

    const category = await this.prisma.company.create({
      select: { id: true, name: true },
      data: { name: createCompanyDto.name },
    });
    return category;
  }

  /**
   * 회사들을 생성합니다.
   *
   * @param sellerId 판매자 아이디가 존재해야 회사를 생성할 수 있습니다.
   * @param createCompanyDtos 생성할 회사들의 정보 입니다.
   */
  async createCompanies(
    sellerId: number,
    createCompanyDtos: { name: string }[],
  ): Promise<{ id: number; name: string }[]> {
    const seller = await this.prisma.seller.findUnique({
      select: { id: true },
      where: { id: sellerId },
    });
    if (!seller) {
      throw new SellerNotFoundException();
    }

    const savedCompanies = await this.prisma.$transaction(
      createCompanyDtos.map((c) =>
        this.prisma.company.create({
          select: { id: true, name: true },
          data: { name: c.name },
        }),
      ),
    );
    return savedCompanies;
  }

  /**
   * 회사를 페이지네이션으로 조회합니다.
   *
   * @param sellerId  판매자 계정의 아이디가 있어야 조회할 수 있습니다.
   * @param paginationDto  페이지네이션 요청 객체입니다.
   */
  async getCompany(
    sellerId: number,
    getCompanyPaginationDto: GetCompanyPaginationDto,
  ): Promise<PaginationResponse<CompanyDto>> {
    const { search, page, limit } = getCompanyPaginationDto;
    const seller = await this.prisma.seller.findUnique({ select: { id: true }, where: { id: sellerId } });
    if (!seller) {
      throw new SellerNotFoundException();
    }

    const { skip, take } = getOffset({ page, limit });

    const [data, count] = await Promise.all([
      this.prisma.company.findMany({
        select: { id: true, name: true },
        skip,
        take,
        where: { ...(search && { name: { contains: search } }) },
        orderBy: [{ name: 'asc' }, { id: 'asc' }],
      }),
      this.prisma.company.count({ where: { ...(search && { name: { contains: search } }) } }),
    ]);
    return { data, skip, count, take };
  }
}
