import { Repository } from 'typeorm';
import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { CreateSellerDto } from '../entities/dtos/create-seller.dto';
import { SellerEntity } from '../entities/seller.entity';

@CustomRepository(SellerEntity)
export class SellerRepository extends Repository<SellerEntity> {
  async saveSeller(createSellerDto: CreateSellerDto) {
    await this.save(createSellerDto);
  }

  async findByEmail(email: string) {
    const [user] = await this.find({
      where: { email },
      withDeleted: true,
      take: 1,
    });
    return user;
  }
}
