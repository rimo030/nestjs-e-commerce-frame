import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductsBundleRespository } from 'src/repositories/products.bundle.repository';
import { ProductsOptionRespository } from 'src/repositories/products.option.repository';
import { ProductsRespository } from 'src/repositories/products.repository';
import { ProductsRequiredRespository } from 'src/repositories/products.required.option.repository';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(ProductsBundleRespository)
    private readonly productsBundleRespository: ProductsBundleRespository,

    @InjectRepository(ProductsRespository)
    private readonly productsRespository: ProductsRespository,

    @InjectRepository(ProductsRequiredRespository)
    private readonly productsRequiredRespository: ProductsRequiredRespository,

    @InjectRepository(ProductsOptionRespository)
    private readonly productsOptionRespository: ProductsOptionRespository,
  ) {}

  async createProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<void> {
    await this.productsBundleRespository.save({ sellerId, ...createProductBundleDto });
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.productsRespository.save(createProductDto);
  }

  async createProductOptions(
    productId: number,
    isRequire: boolean,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<ProductRequiredOptionEntity | ProductOptionEntity> {
    const product = await this.productsRespository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Can't find product id : ${productId}`);
    }

    if (isRequire) {
      return await this.productsRequiredRespository.save({ productId, ...createProductOptionsDto });
    } else {
      return await this.productsOptionRespository.save({ productId, ...createProductOptionsDto });
    }
  }
}
