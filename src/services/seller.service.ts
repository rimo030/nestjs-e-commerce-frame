import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { GetProductBundleDto } from 'src/entities/dtos/get-product-bundle.dto';
import { GetProductOptionDto } from 'src/entities/dtos/get-product-options.dto';
import { GetProductRequiredOptionDto } from 'src/entities/dtos/get-product-required-option.dto';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { ProductNotFoundException, ProductUnauthrizedException } from 'src/exceptions/seller.exception';
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

  async createProductBundle(
    sellerId: number,
    createProductBundleDto: CreateProductBundleDto,
  ): Promise<GetProductBundleDto> {
    const savedProductBundle = await this.productBundleRepository.createProductBundle(sellerId, createProductBundleDto);
    return savedProductBundle;
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<GetProductDto> {
    const savedProduct = await this.productRepository.createProduct(sellerId, createProductDto);
    return savedProduct;
  }

  async createProductOptions(
    sellerId: number,
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<GetProductRequiredOptionDto | GetProductOptionDto> {
    const product = await this.productRepository.getProduct(productId);

    if (!product?.id) {
      throw new ProductNotFoundException();
    }

    if (product?.sellerId !== sellerId) {
      throw new ProductUnauthrizedException();
    }

    if (isRequireOptionDto.isRequire) {
      const savedRequiredOption = await this.productRequiredRepository.createRequiredOption(
        productId,
        createProductOptionsDto,
      );
      return savedRequiredOption;
    } else {
      const savedOption = await this.productOptionRepository.createOption(productId, createProductOptionsDto);
      return savedOption;
    }
  }
}
