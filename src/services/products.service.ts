import { Any } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductParams } from 'src/interfaces/product-params';
import { ProductsRespository } from 'src/repositories/products.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductsRespository)
    private readonly productsRespository: ProductsRespository,
  ) {}

  async getProductList(page: number, limit: number, category: number, seller: number): Promise<ProductEntity[]> {
    console.log(page, limit, category, seller);
    return 1 as any;
  }

  async getProduct(id: number): Promise<any> {}
}
