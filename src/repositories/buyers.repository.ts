import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { BuyerEntity } from 'src/entities/buyer.entity';

@CustomRepository(BuyerEntity)
export class BuyersRespository extends Repository<BuyerEntity> {}
