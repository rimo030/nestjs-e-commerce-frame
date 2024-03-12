import { Repository } from 'typeorm';
import { CartEntity } from 'src/entities/cart.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CartEntity)
export class CartRepository extends Repository<CartEntity> {
  async saveCart(buyerId: number, productId: number): Promise<CartEntity> {
    return await this.save({ buyerId, productId });
  }
  async findCart(buyerId: number, productId: number): Promise<CartEntity | null> {
    const cart = await this.createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartRequiredOptions', 'cartRequiredOption')
      .leftJoinAndSelect('cart.cartOptions', 'cartOption')
      .where('cart.buyerId = :buyerId', { buyerId })
      .andWhere('cart.productId = :productId', { productId })
      .getOne();
    return cart;
  }
}
