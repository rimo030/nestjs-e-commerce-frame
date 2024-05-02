import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { ProductBundleDto } from 'src/entities/dtos/product-bundle.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionDto } from 'src/entities/dtos/product-required-option.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import { SellerNotfoundException } from 'src/exceptions/auth.exception';
import { ProductNotFoundException } from 'src/exceptions/product.exception';
import { ProductUnauthrizedException } from 'src/exceptions/seller.exception';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { PrismaService } from './prisma.service';

@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,

    @InjectRepository(ProductBundleRepository)
    private readonly productBundleRepository: ProductBundleRepository,

    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,

    @InjectRepository(ProductRequiredOptionRepository)
    private readonly productRequiredRepository: ProductRequiredOptionRepository,

    @InjectRepository(ProductOptionRepository)
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  /**
   * 상품 묶음을 저장합니다.
   *
   * @param sellerId 판매자 계정의 아이디가 있어야 상품 묶음을 저장할 수 있습니다.
   * @param createProductBundleDto 저장할 내용을 담은 객체입니다.
   */
  async createProductBundle(
    sellerId: number,
    createProductBundleDto: CreateProductBundleDto,
  ): Promise<ProductBundleDto> {
    const seller = await this.prisma.seller.findUnique({ select: { id: true }, where: { id: sellerId } });
    if (!seller) {
      throw new SellerNotfoundException();
    }

    const productBundle = await this.prisma.productBundle.create({
      select: { id: true, name: true, sellerId: true, chargeStandard: true },
      data: { sellerId, name: createProductBundleDto.name, chargeStandard: createProductBundleDto.chargeStandard },
    });
    return productBundle;
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.saveProduct(sellerId, createProductDto);
    return new ProductDto(product);
  }

  async createProductOptions(
    sellerId: number,
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<ProductRequiredOptionDto | ProductOptionDto> {
    const savedProduct = await this.productRepository.getProductSellerId(productId);

    if (!savedProduct) {
      throw new ProductNotFoundException();
    }

    if (savedProduct.sellerId !== sellerId) {
      throw new ProductUnauthrizedException();
    }

    if (isRequireOptionDto.isRequire) {
      const requiredOption = await this.productRequiredRepository.saveRequiredOption(
        productId,
        createProductOptionsDto,
      );
      return new ProductRequiredOptionDto(requiredOption);
    } else {
      const option = await this.productOptionRepository.saveOption(productId, createProductOptionsDto);
      return new ProductOptionDto(option);
    }
  }
}
