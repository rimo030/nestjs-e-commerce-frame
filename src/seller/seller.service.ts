import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductNotFoundException, ProductUnauthrizedException } from 'src/exceptions/seller.exception';
import { ProductBundleRepository } from 'src/repositories/product.bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product.required.option.repository';
import { CreateProductBundleDto } from 'src/seller/dto/create.product.bundle.dto';
import { CreateProductDto } from 'src/seller/dto/create.product.dto';
import { CreateProductOptionsDto } from 'src/seller/dto/create.product.options.dto';
import { GetProductBundleDto } from 'src/seller/dto/get.product.bundle.dto';
import { GetProductDto } from 'src/seller/dto/get.product.dto';
import { GetProductOptionDto } from 'src/seller/dto/get.product.options.dto';
import { GetProductRequiredOptionDto } from 'src/seller/dto/get.product.required.option.dto';
import { IsRequireOptionDto } from 'src/seller/dto/is.require.option.dto';

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
