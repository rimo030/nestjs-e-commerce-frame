import { ILike, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyEntity } from 'src/entities/company.entity';
import { CompanyDto } from 'src/entities/dtos/company.dto';

Injectable();
export class CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  /**
   * 회사를 생성합니다.
   * @param createCompanyDto 생성할 회사의 데이터 입니다.
   */
  async saveCompany(createCompanyDto: { name: string }): Promise<{ id: number; name: string }> {
    const company = await this.companyRepository.save({ name: createCompanyDto.name });
    return { id: company.id, name: company.name };
  }

  /**
   * 회사들을 생성합니다.
   * @param createCompanyDto 생성할 회사들의 데이터 입니다.
   */
  async saveCompanies(createCompanyDtos: { name: string }[]): Promise<{ id: number; name: string }[]> {
    const dtos = createCompanyDtos.map((c) => ({ name: c.name }));
    const companies = await this.companyRepository.save(dtos);
    return companies.map((c) => ({ id: c.id, name: c.name }));
  }

  /**
   * 회사를 페이지네이션으로 조회합니다.
   * @param skip 건너뛸 요소의 개수 입니다.
   * @param take 가져올 요소의 개수 입니다.
   */
  async getCompany(skip: number, take: number, search: string | null | undefined): Promise<[CompanyDto[], number]> {
    return await this.companyRepository.findAndCount({
      select: {
        id: true,
        name: true,
      },
      ...(search && { where: { name: ILike(`%${search}%`) } }),
      order: {
        name: 'ASC',
        id: 'ASC',
      },
      skip,
      take,
    });
  }
}
