import { Repository } from 'typeorm';
import { CustomRepository } from 'src/configs/custom-typeorm.decorator';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';

@CustomRepository(ProductOptionEntity)
export class ProductOptionRepository extends Repository<ProductOptionEntity> {
  async saveOption(productId: number, createProductOptionsDto: CreateProductOptionsDto): Promise<ProductOptionEntity> {
    return this.save({ productId, ...createProductOptionsDto });
  }

  async getOption(id: number): Promise<ProductOptionDto | null> {
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

  async getProductOptions(productId: number, skip: number, take: number): Promise<[ProductOptionDto[], number]> {
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
