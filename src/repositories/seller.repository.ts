import { Repository } from 'typeorm';
import { SellerEntity } from 'src/entities/seller.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(SellerEntity)
export class SellerRepository extends Repository<SellerEntity> {}
