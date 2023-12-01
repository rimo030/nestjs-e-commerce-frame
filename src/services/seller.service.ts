import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductBundleRepository } from 'src/repositories/product.bundle.repository';
import { ProductRepository } from 'src/repositories/product.repository';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(ProductBundleRepository)
    private readonly productsBundleRespository: ProductBundleRepository,

    @InjectRepository(ProductRepository)
    private readonly productsRespository: ProductRepository,
  ) {}

  async createProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<void> {
    await this.productsBundleRespository.save({ sellerId, ...createProductBundleDto });
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.productsRespository.save(createProductDto);
  }
}
