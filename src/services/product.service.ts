import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductListPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { PaginationResponseDto } from 'src/entities/dtos/pagination-response.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { ProductAllOptionsDto } from 'src/entities/dtos/product-all-options.dto';
import { ProductListDto } from 'src/entities/dtos/product-list.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from 'src/entities/dtos/product-rquired-option-join-input-option.dto';
import {
  ProductNotFoundException,
  ProductsNotFoundException,
  ProductRequiredOptionsNotFoundException,
} from 'src/exceptions/product.exception';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { getOffset } from 'src/util/functions/get-offset.function';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,

    @InjectRepository(ProductRequiredOptionRepository)
    private readonly productRequiredOptionRepository: ProductRequiredOptionRepository,

    @InjectRepository(ProductOptionRepository)
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  async getProduct(id: number): Promise<ProductAllOptionsDto> {
    const product = await this.productRepository.getProduct(id);
    const paginationRequirdOptions = await this.getProductOptions(id, { isRequire: true }, {});
    const paginationOptions = await this.getProductOptions(id, { isRequire: false }, {});
    if (!product) {
      throw new ProductNotFoundException();
    }
    /**
     * @todo remove as
     */
    return new ProductAllOptionsDto(
      product,
      paginationRequirdOptions as PaginationResponseDto<ProductRequiredOptionJoinInputOptionDto>,
      paginationOptions as PaginationResponseDto<ProductOptionDto>,
    );
  }

  async getProductList(
    getProductListPaginationDto: GetProductListPaginationDto,
  ): Promise<PaginationResponseDto<ProductListDto>> {
    const { page, limit, search, categoryId, sellerId } = getProductListPaginationDto;
    const { skip, take } = getOffset({ page, limit });
    const [products, count] = await this.productRepository.getProductList(search, categoryId, sellerId, skip, take);
    if (!products.length) {
      throw new ProductsNotFoundException();
    }

    const productIds = products.map((el) => el.id);
    const rows = await this.productRequiredOptionRepository.getMiniumPriceRows(productIds);
    const productlists = products.map((pl) => {
      const salePrice = rows.find((raw) => raw.productId === pl.id)?.minimumPrice ?? 0;
      return new ProductListDto(pl, salePrice);
    });

    return new PaginationResponseDto(productlists, skip, count, take);
  }

  async getProductOptions(
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<ProductRequiredOptionJoinInputOptionDto | ProductOptionDto>> {
    const { skip, take } = getOffset(paginationDto);

    if (isRequireOptionDto.isRequire) {
      const [data, count] = await this.productRequiredOptionRepository.getRequiredOptionJoinInputOptions(
        productId,
        skip,
        take,
      );
      if (!data.length) {
        throw new ProductRequiredOptionsNotFoundException();
      }
      return new PaginationResponseDto(data, skip, count, take);
    } else {
      const [data, count] = await this.productOptionRepository.getProductOptions(productId, skip, take);
      return new PaginationResponseDto(data, skip, count, take);
    }
  }
}
