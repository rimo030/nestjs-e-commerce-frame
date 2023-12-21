import { Repository } from 'typeorm';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { GetProductOptionDto } from 'src/entities/dtos/get-product-options.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductOptionEntity)
export class ProductOptionRepository extends Repository<ProductOptionEntity> {
  async createOption(productId: number, createProductOptionsDto: CreateProductOptionsDto): Promise<{ id: number }> {
    const { id, ...other } = await this.save({ productId, ...createProductOptionsDto });
    return { id };
  }

  async getOption(id: number): Promise<GetProductOptionDto | null> {
    return await this.findOne({
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
        isSale: true,
      },
      where: {
        id,
      },
    });
  }

  async getProductOptions(productId: number, skip: number, take: number): Promise<[GetProductOptionDto[], number]> {
    return await this.findAndCount({
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
        isSale: true,
      },
      order: {
        id: 'ASC',
      },
      where: {
        productId,
        isSale: true,
      },
      skip,
      take,
    });
  }
}
