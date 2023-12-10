import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductPaginationDto } from 'src/entities/dtos/product-pagination.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { ProductRepository } from 'src/repositories/product.repository';
import { GetProductResponse } from 'src/types/get-product-response.type';
import { getOffset } from 'src/util/functions/get-offset.function';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async getProduct(id: number): Promise<any> {}

  async getProductList(dto: ProductPaginationDto): Promise<GetResponse<ProductEntity>> {
    const { skip, take } = getOffset({ page: dto.page, limit: dto.limit });
    const [list, count] = await this.productRepository.findAndCount({
      order: {
        id: 'ASC',
      },
      skip,
      take,
    });
    return { list, count, take };
  }
}
