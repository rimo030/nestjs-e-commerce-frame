import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductPaginationDto } from 'src/entities/dtos/product-pagination.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { ProductRepository } from 'src/repositories/product.repository';
import { getOffset } from 'src/util/functions/get-offset.function';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
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

    const data = await this.productRepository
      .createQueryBuilder('product')
      .withDeleted()
      // .leftJoinAndSelect('product.productRequiredOptions', 'productRequiredOption') // TypeError: Cannot read properties of undefined (reading 'joinColumns')
      .where('product.id = :id', { id })
      .andWhere('product.isSale = :isSale', { isSale: true })
      .getOne();

    if (data === null) {
      throw new NotFoundException(`Can't find product id : ${id}`);
    }
    return data;
  }

  async getProductList(dto: ProductPaginationDto): Promise<GetResponse<ProductEntity>> {
    const { page, limit, search, categoryId, sellerId } = dto;
    const { skip, take } = getOffset({ page, limit });
    const [list, count] = await this.productRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      where: {
        ...{ categoryId: categoryId ?? undefined },
        ...{ sellerId: sellerId ?? undefined },
      },
      skip,
      take,
    });
    return { list, count, take };
  }
}
