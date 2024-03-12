import { Repository, UpdateResult } from 'typeorm';
import { CartRequiredOptionEntity } from 'src/entities/cart-required-option.entity';
import { CreateCartRequiredOptionDto } from 'src/entities/dtos/create-cart-required-option.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CartRequiredOptionEntity)
export class CartRequiredOptionRepository extends Repository<CartRequiredOptionEntity> {
  async saveCart(
    cartId: number,
    createCartRequiredOptionDto: CreateCartRequiredOptionDto[],
  ): Promise<CartRequiredOptionEntity[]> {
    const entitiesToSave = createCartRequiredOptionDto.map((dto) => ({ cartId, ...dto }));
    return await this.save(entitiesToSave);
  }

  async increaseCount(ids: number[]): Promise<UpdateResult> {
    return await this.createQueryBuilder()
      .update(CartRequiredOptionEntity)
      .set({ count: () => `count + ${1}` })
      .where('id IN (:...ids)', { ids: ids })
      .execute();
  }
}
