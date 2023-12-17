import { ILike } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/products.required.option.repository';
import { getOffset } from 'src/util/functions/get-offset.function';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,

    @InjectRepository(ProductRequiredOptionRepository)
    private readonly productRequiredOptionRepository: ProductRequiredOptionRepository,

    @InjectRepository(ProductOptionRepository)
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  async getProduct(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id,
      },
    });

    if (!product?.id) {
      throw new NotFoundException(`Can't find product id : ${id}`);
    }

    return product;
  }

  async getProductList(dto: GetProductPaginationDto): Promise<GetResponse<ProductEntity>> {
    const { page, limit, search, categoryId, sellerId } = dto;
    const { skip, take } = getOffset({ page, limit });
    const [list, count] = await this.productRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      where: {
        ...{ categoryId: categoryId ?? undefined },
        ...{ sellerId: sellerId ?? undefined },
        ...{ name: search ? ILike(`%${search}%`) : undefined },
      },
      skip,
      take,
    });

    const productIds = list.map((el) => el.id);

    if (productIds.length) {
      const raws: { productId: number; minimumPrice: number }[] = await this.productRequiredOptionRepository
        .createQueryBuilder('pro')
        .select('pro.productId as productId')
        .addSelect('MIN(pro.price) as minimumPrice')
        .where('pro.productId IN (:...productIds)', { productIds })
        .groupBy('pro.productId')
        .getRawMany();

      list.forEach((product) => {
        (product as any).minimumPrice = raws.find((raw) => raw.productId === product.id)?.minimumPrice ?? 0;
      });
    }

    return { list, count, take };
  }

  async getProductRequiredOptions(productId: number): Promise<ProductRequiredOptionEntity[]> {
    const requiredOptions = await this.productRequiredOptionRepository.find({
      where: {
        productId,
      },
    });
    return requiredOptions;
  }

  async getProductOptions(productId: number): Promise<ProductOptionEntity[]> {
    const Options = await this.productOptionRepository.find({
      where: {
        productId,
      },
    });
    return Options;
  }
}
