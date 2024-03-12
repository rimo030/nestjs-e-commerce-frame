import { Repository } from 'typeorm';
import { CartOptionEntity } from 'src/entities/cart-option.entity';
import { CreateCartOptionDto } from 'src/entities/dtos/create-cart-option.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CartOptionEntity)
export class CartOptionRepository extends Repository<CartOptionEntity> {
  async saveCart(cartId: number, createCartOptionDto: CreateCartOptionDto[]): Promise<CartOptionEntity[]> {
    const entitiesToSave = createCartOptionDto.map((dto) => ({ cartId, ...dto }));
    return await this.save(entitiesToSave);
  }

  async increaseCount(ids: number[]) {
    return await this.createQueryBuilder()
      .update(CartOptionEntity)
      .set({ count: () => `count + ${1}` })
      .where('id IN (:...ids)', { ids: ids })
      .execute();
  }
}
