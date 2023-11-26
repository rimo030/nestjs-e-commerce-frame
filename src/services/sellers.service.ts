import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductsBundleRespository } from 'src/repositories/products.bundle.repository';
import { ProductsRespository } from 'src/repositories/products.repository';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(ProductsBundleRespository)
    private readonly productsBundleRespository: ProductsBundleRespository,

    @InjectRepository(ProductsRespository)
    private readonly productsRespository: ProductsRespository,
  ) {}

  async createProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<void> {
    await this.productsBundleRespository.save({ sellerId, ...createProductBundleDto });
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.productsRespository.save(createProductDto);
  }
}
