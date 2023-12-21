import { ILike } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { GetProductListPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { GetProductOptionDto } from 'src/entities/dtos/get-product-options.dto';
import { GetProductRequiredOptionDto } from 'src/entities/dtos/get-product-required-option.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { ProductElement } from 'src/interfaces/product-element.interface';
import { ProductInputOptionRepository } from 'src/repositories/product-input-option.repository';
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

  async getProduct(id: number): Promise<CreateProductDto> {
    const product = await this.productRepository.getProduct(id);

    if (!product) {
      throw new NotFoundException(`Can't find product id : ${id}`);
    }

    return product;
  }

  async getProductList(dto: GetProductListPaginationDto): Promise<GetResponse<ProductElement>> {
    const { page, limit, search, categoryId, sellerId } = dto;
    const { skip, take } = getOffset({ page, limit });
    const [products, count] = await this.productRepository.getProductList(search, categoryId, sellerId, skip, take);

    if (!products.length) {
      throw new NotFoundException(`Can't find Products`);
    }

    const productIds = products.map((el) => el.id);
    const rows = await this.productRequiredOptionRepository.getMiniumPriceRows(productIds);
    return {
      list: products.map((product) => {
        const salePrice = rows.find((raw) => raw.productId === product.id)?.minimumPrice ?? 0;
        return { ...product, salePrice };
      }),
      count,
      take,
    };
  }

  async getProductOptions(
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    paginationDto: PaginationDto,
  ): Promise<GetResponse<GetProductRequiredOptionDto | GetProductOptionDto>> {
    const { isRequire } = isRequireOptionDto;
    const { skip, take } = getOffset(paginationDto);

    if (isRequire) {
      const [list, count] = await this.productRequiredOptionRepository.getRequiredOptionJoinInputOptions(
        productId,
        skip,
        take,
      );
      if (!list.length) new NotFoundException(`There is no required option for product ${productId}.`);
      return { list, count, take };
    } else {
      const [list, count] = await this.productOptionRepository.getProductOptions(productId, skip, take);
      return { list, count, take };
    }
  }
}
