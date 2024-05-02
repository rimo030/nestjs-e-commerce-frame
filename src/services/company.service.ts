import { Injectable } from '@nestjs/common';
import { GetCompanyDto } from 'src/entities/dtos/get-company.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { SellerNotfoundException } from 'src/exceptions/auth.exception';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { getOffset } from 'src/util/functions/get-offset.function';
import { PrismaService } from './prisma.service';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async getCompany(sellerId: number, paginationDto: PaginationDto): Promise<GetResponse<GetCompanyDto>> {
    const seller = await this.prisma.seller.findUnique({ select: { id: true }, where: { id: sellerId } });

    if (!seller) {
      throw new SellerNotfoundException();
    }

    const { skip, take } = getOffset(paginationDto);

    const data = await this.prisma.company.findMany({
      select: { id: true, name: true },
      skip,
      take,
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });

    const count = await this.prisma.company.count();

    return { data, skip, count, take };
  }
}
