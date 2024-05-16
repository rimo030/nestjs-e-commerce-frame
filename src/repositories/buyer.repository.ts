import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyerEntity } from '../entities/buyer.entity';
import { CreateBuyerDto } from '../entities/dtos/create-buyer.dto';

@Injectable()
export class BuyerRepository {
  constructor(
    @InjectRepository(BuyerEntity)
    private buyerRepository: Repository<BuyerEntity>,
  ) {}

  /**
   * buyer를 저장합니다.
   * @param createBuyerDto 저장할 buyer의 정보입니다.
   */
  async saveBuyer(createBuyerDto: CreateBuyerDto): Promise<{ id: number }> {
    const { email, password, name, gender, age, phone } = createBuyerDto;
    const buyer = await this.buyerRepository.save({ email, password, name, gender, age, phone });
    return { id: buyer.id };
  }

  /**
   * 해당 아이디를 가진 buyer가 있는지 확인합니다.
   * @param id 확인할 buyer의 아이디 입니다.
   */
  async findById(id: number): Promise<{ id: number } | null> {
    return await this.buyerRepository.findOne({
      select: { id: true },
      where: { id },
    });
  }

  /**
   *  해당 이메일을 가진 buyer의 이메일과 비밀번호를 조회합니다.
   * @param email 확인할 이메일 입니다.
   */
  async findBuyer(email: string): Promise<{ id: number; password: string } | null> {
    return await this.buyerRepository.findOne({
      select: { id: true, password: true },
      where: { email },
      withDeleted: true,
    });
  }
  /**
   *  해당 이메일을 가진 buyer가 존재하는지 확인합니다.
   * @param email 확인할 이메일 입니다.
   */
  async findByEmail(email: string): Promise<{ id: number } | null> {
    return await this.buyerRepository.findOne({
      select: { id: true },
      where: { email },
      withDeleted: true,
    });
  }
}
