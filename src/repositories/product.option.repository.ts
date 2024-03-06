import { Repository } from 'typeorm';
import { CustomRepository } from 'src/configs/custom-typeorm.decorator';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { CreateProductOptionsDto } from 'src/seller/dto/create.product.options.dto';
import { GetProductOptionDto } from 'src/seller/dto/get.product.options.dto';

@CustomRepository(ProductOptionEntity)
export class ProductOptionRepository extends Repository<ProductOptionEntity> {
  async createOption(
    productId: number,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<GetProductOptionDto> {
    return this.save({ productId, ...createProductOptionsDto });
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
