import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(ProductBundleRepository)
    private readonly productBundleRepository: ProductBundleRepository,

    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,

    @InjectRepository(ProductRequiredOptionRepository)
    private readonly productRequiredRepository: ProductRequiredOptionRepository,

    @InjectRepository(ProductOptionRepository)
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  async createProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<void> {
    await this.productBundleRepository.save({ sellerId, ...createProductBundleDto });
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.productRepository.save({ sellerId, ...createProductDto });
  }

  async createProductOptions(
    sellerId: number,
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<ProductOptionEntity | ProductRequiredOptionEntity> {
    const product = await this.productRepository.getProduct(productId);

    if (!product?.id) {
      throw new NotFoundException(`Can't find product id : ${productId}`);
    }

    if (product?.sellerId !== sellerId) {
      throw new UnauthorizedException('You are not seller of this product.');
    }

    if (isRequireOptionDto.isRequire) {
      return await this.productRequiredRepository.save({ productId, ...createProductOptionsDto });
    } else {
      return await this.productOptionRepository.save({ productId, ...createProductOptionsDto });
    }
  }
}
