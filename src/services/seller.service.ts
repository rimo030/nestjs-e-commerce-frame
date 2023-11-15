import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { SellerEntity } from 'src/entities/seller.entity';
import { SellerRespository } from 'src/repositories/seller.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerRespository)
    private readonly sellerRepository: SellerRespository,
  ) {}

  // seller 생성
  async createSeller(createSellerDto: CreateSellerDto): Promise<SellerEntity> {
    const seller = await this.sellerRepository.findOneBy({ email: createSellerDto.email });
    if (seller) {
      throw new UnauthorizedException('this email already exists');
    }

    const salt = await bcrypt.genSalt();
    createSellerDto.hashedPassword = await bcrypt.hash(createSellerDto.hashedPassword, salt);
    return await this.sellerRepository.save({
      ...createSellerDto,
    });
  }
}
