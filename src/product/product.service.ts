import { ILike } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProductNotFoundException,
  ProductRequiredOptionsNotFoundException,
  ProductsNotFoundException,
} from 'src/exceptions/product.exception';
import { GetResponse } from 'src/interfaces/get-response.interface';
import { ProductListElement } from 'src/interfaces/product-list-element.interface';
import { GetProductListPaginationDto } from 'src/product/dto/get-product-list-pagination.dto';
import { ProductInputOptionRepository } from 'src/repositories/product.input.option.repository';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product.required.option.repository';
import { CreateProductDto } from 'src/seller/dto/create.product.dto';
import { GetProductOptionDto } from 'src/seller/dto/get.product.options.dto';
import { GetProductRequiredOptionDto } from 'src/seller/dto/get.product.required.option.dto';
import { IsRequireOptionDto } from 'src/seller/dto/is.require.option.dto';
import { getOffset } from 'src/util/functions/get-offset.function';
import { PaginationDto } from 'src/util/pagination/pagination.dto';

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
      throw new ProductNotFoundException();
    }

    return product;
  }

  async getProductList(dto: GetProductListPaginationDto): Promise<GetResponse<ProductListElement>> {
    const { page, limit, search, categoryId, sellerId } = dto;
    const { skip, take } = getOffset({ page, limit });
    const [products, count] = await this.productRepository.getProductList(search, categoryId, sellerId, skip, take);

    if (!products.length) {
      throw new ProductsNotFoundException();
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
      if (!list.length) throw new ProductRequiredOptionsNotFoundException();
      return { list, count, take };
    } else {
      const [list, count] = await this.productOptionRepository.getProductOptions(productId, skip, take);
      return { list, count, take };
    }
  }
}
