import { Repository } from 'typeorm';
import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { BuyerEntity } from '../entities/buyer.entity';
import { CreateBuyerDto } from '../entities/dtos/create-buyer.dto';

@CustomRepository(BuyerEntity)
export class BuyerRepository extends Repository<BuyerEntity> {
  async saveBuyer(createBuyerDto: CreateBuyerDto): Promise<void> {
    await this.insert(createBuyerDto);
  }

  async findById(id: number): Promise<BuyerEntity> {
    const [user] = await this.find({
      where: { id },
      withDeleted: true,
      take: 1,
    });
    return user;
  }

  async findByEmail(email: string): Promise<BuyerEntity> {
    const [user] = await this.find({
      where: { email },
      withDeleted: true,
      take: 1,
    });
    return user;
  }

  async deleteById(id: number): Promise<void> {
    await this.delete({ id });
  }
}
