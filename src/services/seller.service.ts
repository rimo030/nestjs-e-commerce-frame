import { Injectable } from '@nestjs/common';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { ProductBundleDto } from 'src/entities/dtos/product-bundle.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionDto } from 'src/entities/dtos/product-required-option.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import { SellerNotfoundException } from 'src/exceptions/auth.exception';
import { ProductBundleNotFoundException, ProductNotFoundException } from 'src/exceptions/product.exception';
import { ProductUnauthrizedException } from 'src/exceptions/seller.exception';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { SellerRepository } from 'src/repositories/seller.repository';

@Injectable()
export class SellerService {
  constructor(
    private readonly productBundleRepository: ProductBundleRepository,
    private readonly productRepository: ProductRepository,
    private readonly productRequiredOptionRepository: ProductRequiredOptionRepository,
    private readonly productOptionRepository: ProductOptionRepository,
    private readonly sellerRepository: SellerRepository,
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
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new SellerNotfoundException();
    }

    const productBundle = await this.productBundleRepository.saveProductBundle(sellerId, createProductBundleDto);
    return productBundle;
  }

  /**
   * 상품을 생성합니다.
   *
   * @param sellerId 판매자 계정의 아이디가 있어야 상품 묶음을 저장할 수 있습니다.
   * @param createProductDto 저장할 상품의 데이터 입니다.
   */
  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductDto> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new SellerNotfoundException();
    }

    const product = await this.productRepository.saveProduct(sellerId, createProductDto);
    return product;
  }

  /**
   * 상품 필수/선택 옵션을 생성합니다.
   *
   * @param sellerId 상품의 판매자 계정이 맞아야 상품 묶음을 저장할 수 있습니다.
   * @param productId 옵션을 생성할 상품의 아이디 입니다.
   * @param isRequireOptionDto 필수 옵션 / 선택 옵션의 여부를 나타냅니다.
   * @param createProductOptionsDto 저장할 옵션의 데이터 입니다.
   */
  async createProductOptions(
    sellerId: number,
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<ProductRequiredOptionDto | ProductOptionDto> {
    const savedProduct = await this.productRepository.getProduct(productId);
    if (!savedProduct) {
      throw new ProductNotFoundException();
    }

    if (savedProduct.sellerId !== sellerId) {
      throw new ProductUnauthrizedException();
    }

    if (isRequireOptionDto.isRequire) {
      const requiredOption = await this.productRequiredOptionRepository.saveRequiredOption(
        productId,
        createProductOptionsDto,
      );
      return requiredOption;
    } else {
      const option = await this.productOptionRepository.saveOption(productId, createProductOptionsDto);
      return option;
    }
  }

  /**
   * 상품 묶음을 조회합니다.
   * @param bundleId 조회할 상품 묶음의 아이디 입니다.
   */
  async getProductBundle(bundleId: number): Promise<ProductBundleDto> {
    const productBundle = await this.productBundleRepository.getProductBundle(bundleId);
    if (!productBundle) {
      throw new ProductBundleNotFoundException();
    }
    return productBundle;
  }
}
