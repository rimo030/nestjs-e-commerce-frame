import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSellerDto } from 'src/entities/dtos/create-seller.dto';
import { SellerEntity } from 'src/entities/seller.entity';

@Injectable()
export class SellerRepository {
  constructor(
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
  ) {}

  /**
   * seller를 저장합니다.
   * @param createSellerDto
   */
  async saveSeller(createSellerDto: CreateSellerDto): Promise<{ id: number }> {
    const { email, password, name, businessNumber, phone } = createSellerDto;
    const seller = await this.sellerRepository.save({ email, password, name, businessNumber, phone });
    return { id: seller.id };
  }

  /**
   * 해당 아이디를 가진 seller가 있는지 확인합니다.
   * @param id 확인할 아이디 입니다.
   */
  async findById(id: number): Promise<{ id: number } | null> {
    const seller = await this.sellerRepository.findOne({
      select: { id: true },
      where: { id },
    });
    return seller ? { id: seller.id } : null;
  }

  /**
   * 해당 이메일을 가진 seller의 이메일과 비밀번호를 조회합니다.
   * @param email 확인할 이메일 입니다.
   */
  async findSeller(email: string): Promise<{ id: number; password: string } | null> {
    const seller = await this.sellerRepository.findOne({
      select: { id: true, password: true },
      where: { email },
      withDeleted: true,
    });

    return seller ? { id: seller.id, password: seller.password } : null;
  }
  /**
   * 해당 이메일을 가진 seller가 존재하는지 확인합니다.
   * @param email 확인할 이메일 입니다.
   */
  async findByEmail(email: string): Promise<{ id: number } | null> {
    const seller = await this.sellerRepository.findOne({
      select: { id: true },
      where: { email },
      withDeleted: true,
    });

    return seller ? { id: seller.id } : null;
  }
}
