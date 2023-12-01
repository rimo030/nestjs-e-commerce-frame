import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductBundleRepository } from 'src/repositories/product.bundle.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductsOptionRespository } from 'src/repositories/products.option.repository';
import { ProductsRequiredOptionRespository } from 'src/repositories/products.required.option.repository';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(ProductBundleRepository)
    private readonly productBundleRepository: ProductBundleRepository,

    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,

    @InjectRepository(ProductsRequiredOptionRespository)
    private readonly productsRequiredRespository: ProductsRequiredOptionRespository,

    @InjectRepository(ProductsOptionRespository)
    private readonly productsOptionRespository: ProductsOptionRespository,
  ) {}

  async createProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<void> {
    await this.productBundleRepository.save({ sellerId, ...createProductBundleDto });
  }

  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductEntity> {
    return await this.productRepository.save(createProductDto);
  }

  async createProductOptions(
    sellerId: number,
    productId: number,
    isRequire: boolean,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<ProductRequiredOptionEntity | ProductOptionEntity> {
    /**
     * todo 지금 생성하려는 옵션의 상품을 가져온 뒤, 이 상품의 판매자가 맞는지 체크하는 방어 로직이 필요
     *
     *  seller의 모든 작업에 필요하지 않나?? 그럼 별도의 함수로 분리해야 하지 않나?
     */

    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Can't find product id : ${productId}`);
    }

    /**
     * const context = isRequire ? A : B;
     * return await context.save(dto);
     * 이런 식으로도 표현 가능하겠죠?
     *
     */
    const res = isRequire ? this.productsRequiredRespository : this.productsOptionRespository;
    return await res.save({ productId, ...createProductOptionsDto }); // error??
  }
}
