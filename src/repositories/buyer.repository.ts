import { Repository } from 'typeorm';
import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { BuyerEntity } from '../entities/buyer.entity';
import { CreateBuyerDto } from '../entities/dtos/create-buyer.dto';

@CustomRepository(BuyerEntity)
export class BuyerRepository extends Repository<BuyerEntity> {
  async saveBuyer(createBuyerDto: CreateBuyerDto) {
    await this.save(createBuyerDto);
  }

  async findByEmail(email: string) {
    const [user] = await this.find({
      where: { email },
      withDeleted: true,
      take: 1,
    });
    return user;
  }

  async deleteById(id: number) {
    await this.delete({ id });
  }
}
