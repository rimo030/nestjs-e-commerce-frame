import { CustomRepository } from '../configs/custom-typeorm.decorator';
import { Repository } from 'typeorm';
import { SellerEntity } from 'src/entities/seller.entity';

@CustomRepository(SellerEntity)
export class SellersRespository extends Repository<SellerEntity> {}
