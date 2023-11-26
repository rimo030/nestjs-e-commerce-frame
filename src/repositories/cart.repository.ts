import { Repository } from 'typeorm';
import { CartEntity } from 'src/entities/cart.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CartEntity)
export class CartRespository extends Repository<CartEntity> {}
