import { Repository, ILike } from 'typeorm';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductElement } from 'src/interfaces/product-element.interface';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async getProduct(id: number): Promise<GetProductDto | null> {
    return await this.findOne({
      select: {
        id: true,
        bundleId: true,
        categoryId: true,
        companyId: true,
        isSale: true,
        name: true,
        description: true,
        deliveryType: true,
        deliveryFreeOver: true,
        deliveryCharge: true,
        img: true,
      },
      where: {
        id,
      },
    });
  }

  async getProductList(
    search: string | undefined | null,
    categoryId: number | undefined | null,
    sellerId: number | undefined | null,
    skip: number,
    take: number,
  ): Promise<[Omit<ProductElement, 'salePrice'>[], number]> {
    return await this.findAndCount({
      select: {
        id: true,
        categoryId: true,
        companyId: true,
        name: true,
        deliveryType: true,
        img: true,
      },
      order: {
        id: 'DESC',
      },
      where: {
        isSale: true,
        ...{ categoryId: categoryId ?? undefined },
        ...{ sellerId: sellerId ?? undefined },
        ...{ name: search ? ILike(`%${search}%`) : undefined },
      },
      skip,
      take,
    });
  }
}
