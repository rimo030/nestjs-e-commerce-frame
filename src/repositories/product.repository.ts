import { Repository, ILike } from 'typeorm';
import { CustomRepository } from 'src/configs/custom-typeorm.decorator';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { feeStandard } from 'src/types/enums/fee-standard.enum';

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async saveProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.save({ sellerId, ...createProductDto });
  }

  async getProductSellerId(id: number): Promise<{ sellerId: number } | null> {
    return await this.findOne({
      select: {
        sellerId: true,
      },
      where: {
        id,
      },
    });
  }

  async getProduct(id: number): Promise<ProductEntity | null> {
    return await this.findOne({ where: { id } });
  }

  async getProductList(
    search: string | undefined | null,
    categoryId: number | undefined | null,
    sellerId: number | undefined | null,
    skip: number,
    take: number,
  ): Promise<[ProductDto[], number]> {
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

  async getProductsByBundleGroup(
    ids: number[],
  ): Promise<{ bundleId: number; chargeStandard: keyof typeof feeStandard; productIds: number[] }[]> {
    const results = await this.createQueryBuilder('product')
      .leftJoinAndSelect('product.bundle', 'bundle')
      .select([
        'product.bundleId AS bundleId',
        'bundle.chargeStandard As chargeStandard',
        'GROUP_CONCAT(product.id) AS productIds',
      ])
      .whereInIds(ids)
      .groupBy('product.bundleId')
      .getRawMany();

    return results.map((result) => ({
      bundleId: result.bundleId,
      chargeStandard: result.chargeStandard,
      productIds: result.productIds.split(',').map((id) => parseInt(id)),
    }));
  }
}
