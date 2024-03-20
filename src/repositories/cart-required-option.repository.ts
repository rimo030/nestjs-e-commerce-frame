import { Repository } from 'typeorm';
import { CartRequiredOptionEntity } from 'src/entities/cart-required-option.entity';
import { CreateCartRequiredOptionDto } from 'src/entities/dtos/create-cart-required-option.dto';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(CartRequiredOptionEntity)
export class CartRequiredOptionRepository extends Repository<CartRequiredOptionEntity> {
  async saveCartRequiredOptions(
    cartId: number,
    createCartRequiredOptionDto: CreateCartRequiredOptionDto[],
  ): Promise<CartRequiredOptionEntity[]> {
    const entitiesToSave = createCartRequiredOptionDto.map((dto) => ({ cartId, ...dto }));
    return await this.save(entitiesToSave);
  }

  async increaseRequiredOptionsCount(options: { id: number; count: number }[]): Promise<number[]> {
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
