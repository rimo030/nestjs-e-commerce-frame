import { Repository } from 'typeorm';
import { BuyerEntity } from 'src/entities/buyer.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(BuyerEntity)
export class BuyerRepository extends Repository<BuyerEntity> {}
