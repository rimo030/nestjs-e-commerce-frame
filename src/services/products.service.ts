import { Any } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostProductDto } from 'src/entities/dtos/get-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductParams } from 'src/interfaces/product-params';
import { ProductsRespository } from 'src/repositories/products.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsRespository)
    private readonly productsRespository: ProductsRespository,
  ) {}

  // params가 주어지지 않았을 때
  async getProductList(params: PostProductDto): Promise<ProductEntity[] | null> {
    const result = await this.productsRespository
      .createQueryBuilder('product')
      .withDeleted() // 작동안함..
      .limit(params.limit)
      .andWhere('product.isSale = :isSale', { isSale: 0 })
      .getMany();

    return result;
  }

  async getProduct(id: number): Promise<any> {}
}
