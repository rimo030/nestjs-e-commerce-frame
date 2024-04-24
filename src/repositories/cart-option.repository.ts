import { Repository } from 'typeorm';
import { CartOptionEntity } from 'src/entities/cart-option.entity';
import { CreateCartOptionDto } from 'src/entities/dtos/create-cart-option.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CartOptionEntity)
export class CartOptionRepository extends Repository<CartOptionEntity> {
  async saveCartOptions(cartId: number, createCartOptionDto: CreateCartOptionDto[]): Promise<CartOptionEntity[]> {
    const entitiesToSave = createCartOptionDto.map((dto) => ({ cartId, ...dto }));
    return await this.save(entitiesToSave);
  }

  async updateOptionsCount(id: number, count: number): Promise<number | null> {
    const updateResult = await this.update(id, { count });
    return updateResult.affected ? id : null;
  }

  async increaseOptionsCount(options: { id: number; count: number }[]): Promise<number[]> {
    const updatedIds: number[] = [];

    await Promise.all(
      options.map(async (option) => {
        const updateResult = await this.increment({ id: option.id }, 'count', option.count);
        if (updateResult.affected !== 0) {
          updatedIds.push(option.id);
        }
      }),
    );
    return updatedIds;
  }
}
