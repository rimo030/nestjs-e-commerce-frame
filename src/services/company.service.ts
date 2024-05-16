import { Injectable } from '@nestjs/common';
import { CompanyDto } from 'src/entities/dtos/company.dto';
import { GetCompanyPaginationDto } from 'src/entities/dtos/get-company-pagination.dto';
import { SellerNotfoundException } from 'src/exceptions/auth.exception';
import { PaginationResponse } from 'src/interfaces/pagination-response.interface';
import { CompanyRepository } from 'src/repositories/company.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { getOffset } from 'src/util/functions/pagination-util.function';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly sellerRepository: SellerRepository,
  ) {}

  /**
   * 회사를 생성합니다.
   * @param sellerId 판매자 아이디가 존재해야 회사를 생성할 수 있습니다.
   * @param createCompanyDto 생성할 회사의 정보입니다.
   */
  async createCompany(sellerId: number, createCompanyDto: { name: string }): Promise<{ id: number; name: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new SellerNotfoundException();
    }

    const category = await this.companyRepository.saveCompany(createCompanyDto);
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
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new SellerNotfoundException();
    }

    const savedCompanies = await this.companyRepository.saveCompanies(createCompanyDtos);
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
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new SellerNotfoundException();
    }
    const { skip, take } = getOffset({ page, limit });

    const [data, count] = await this.companyRepository.getCompany(skip, take, search);
    return { data, skip, count, take };
  }
}
