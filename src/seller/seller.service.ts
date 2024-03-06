import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductNotFoundException } from 'src/exceptions/product.exception';
import { ProductUnauthrizedException } from 'src/exceptions/seller.exception';
import { ProductBundleRepository } from 'src/repositories/product.bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product.required.option.repository';
import { CreateProductBundleDto } from './dto/create.product.bundle.dto';
import { CreateProductDto } from './dto/create.product.dto';
import { CreateProductOptionsDto } from './dto/create.product.options.dto';
import { IsRequireOptionDto } from './dto/is.require.option.dto';

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

  async createProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<{ id: number }> {
    const { id, ...rest } = await this.productBundleRepository.saveProductBundle(sellerId, createProductBundleDto);
    return { id };
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<{ id: number }> {
    const { id, ...rest } = await this.productRepository.saveProduct(sellerId, createProductDto);
    return { id };
  }

  async createProductOptions(
    sellerId: number,
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<{ id: number }> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new ProductNotFoundException();
    }

    if (product.sellerId !== sellerId) {
      throw new ProductUnauthrizedException();
    }

    if (isRequireOptionDto.isRequire) {
      const { id, ...rest } = await this.productRequiredRepository.saveRequiredOption(
        productId,
        createProductOptionsDto,
      );
      return { id };
    } else {
      const { id, ...rest } = await this.productOptionRepository.saveOption(productId, createProductOptionsDto);
      return { id };
    }
  }
}
