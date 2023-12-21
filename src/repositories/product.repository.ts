import { Repository, ILike } from 'typeorm';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductListElement } from 'src/interfaces/product-list-element.interface';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<{ id: number }> {
    const { id, ...other } = await this.save({ sellerId, ...createProductDto });
    return { id };
  }

  async getProduct(id: number): Promise<GetProductDto | null> {
    return await this.findOne({
      select: {
        id: true,
        sellerId: true,
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
  ): Promise<[Omit<ProductListElement, 'salePrice'>[], number]> {
    return await this.findAndCount({
      select: {
        id: true,
        sellerId: true,
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
