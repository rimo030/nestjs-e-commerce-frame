import { Injectable } from '@nestjs/common';
import { GetProductListPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { PaginationResponseDto } from 'src/entities/dtos/pagination-response.dto';
import { PaginationDto } from 'src/entities/dtos/pagination.dto';
import { ProductAllOptionsDto } from 'src/entities/dtos/product-all-options.dto';
import { ProductListDto } from 'src/entities/dtos/product-list.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from 'src/entities/dtos/product-rquired-option-join-input-option.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import {
  ProductNotFoundException,
  ProductsNotFoundException,
  ProductRequiredOptionsNotFoundException,
} from 'src/exceptions/product.exception';
import { createPaginationResponseDto } from 'src/util/functions/create-pagination-response-dto.function';
import { getOffset } from 'src/util/functions/get-offset.function';
import { PrismaService } from './prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductById(id: number): Promise<ProductDto> {
    const product = await this.prisma.product.findUnique({
      select: {
        id: true,
        sellerId: true,
        bundleId: true,
        categoryId: true,
        companyId: true,
        isSale: true,
        name: true,
        description: true,
        deliveryType: true,
        deliveryFreeOver: true,
        deliveryCharge: true,
        img: true,
      },
      where: { id },
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    return product;
  }

  /**
   * 상품과 상품 옵션의 정보들을 조회합니다.
   * 상품 옵션은 페이지네이션으로 1페이지 (10개)가 조회됩니다.
   *
   * @param id 조회할 상품의 아이디 입니다.
   */
  async getProduct(id: number): Promise<ProductAllOptionsDto> {
    const product = await this.getProductById(id);
    const paginationRequirdOptions = await this.getRequiredOptionJoinInputOptions(id, {});
    const paginationOptions = await this.getProductOptions(id, {});

    if (!product) {
      throw new ProductNotFoundException();
    }
    return { product, productRequiredOptions: paginationRequirdOptions, productOptions: paginationOptions };
  }

  /**
   * 상품의 목록과 최소 가격을 페이지네이션으로 조회합니다.
   * 상품명, 카테고리명, 판매자ID 검색 쿼리를 설정할 수 있습니다.
   *
   * @param getProductListPaginationDto 요청 쿼리 객체 입니다.
   */
  async getProductListWithMiniumPrice(
    getProductListPaginationDto: GetProductListPaginationDto,
  ): Promise<PaginationResponseDto<ProductListDto>> {
    const { skip, take } = getOffset({
      page: getProductListPaginationDto.page,
      limit: getProductListPaginationDto.limit,
    });
    const products = await this.getProductList(getProductListPaginationDto);

    const productIds = products.map((p) => p.id);
    const miniumPriceRows = await this.getMinimumPriceRows(productIds);

    const data = products.map((p) => {
      const salePrice = miniumPriceRows.find((r) => r.productId === p.id)?.minimumPrice ?? 0;
      return { ...p, salePrice };
    });

    const count = await this.prisma.product.count();
    return createPaginationResponseDto({ data, skip, count, take });
  }

  /**
   * 상품들의 최소 가격을 계산하여 반환합니다.
   * 조회되지 않는다면 0원으로 설정됩니다.
   *
   * @param productIds 상품의 아이디 배열입니다.
   */
  async getMinimumPriceRows(productIds: number[]) {
    const minimumPriceRows = await this.prisma.productRequiredOption.groupBy({
      by: ['productId'],
      _min: { price: true },
      where: {
        productId: {
          in: productIds,
        },
      },
    });

    return minimumPriceRows.map((row) => ({
      productId: row.productId,
      minimumPrice: row._min.price ?? 0,
    }));
  }

  /**
   * 상품의 정보를 페이지 네이션으로 조회합니다.
   * 상품명, 카테고리명, 판매자ID 검색 쿼리를 설정할 수 있습니다.
   *
   * @param getProductListPaginationDto 요청 쿼리 객체 입니다.
   *
   */
  async getProductList(getProductListPaginationDto: GetProductListPaginationDto) {
    const { page, limit, search, categoryId, sellerId } = getProductListPaginationDto;
    const { skip, take } = getOffset({ page, limit });

    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        sellerId: true,
        categoryId: true,
        companyId: true,
        name: true,
        deliveryType: true,
        img: true,
      },
      orderBy: {
        id: 'desc',
      },
      where: {
        isSale: true,
        ...{ categoryId: categoryId ?? undefined },
        ...{ sellerId: sellerId ?? undefined },
        ...{ name: search ? { contains: search } : undefined },
      },
      skip,
      take,
    });

    if (!products.length) {
      throw new ProductsNotFoundException();
    }
    return products;
  }

  /**
   * 해당 productId를 가진 옵션들을 조회합니다.
   *
   * @param productId 조회할 상품의 Id 입니다.
   * @param isRequireOptionDto 필수옵션, 선택 옵션의 여부입니다.
   * @param paginationDto 페이지 네이션 요청 객체 입니다.
   *
   */
  async getProductOption(
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<ProductOptionDto | ProductRequiredOptionJoinInputOptionDto>> {
    if (isRequireOptionDto.isRequire) {
      const paginationRequirdOptions = await this.getRequiredOptionJoinInputOptions(productId, paginationDto);
      return paginationRequirdOptions;
    } else {
      const paginationOptions = await this.getProductOptions(productId, paginationDto);
      return paginationOptions;
    }
  }

  /**
   * 해당 productId를 가진 상품 필수옵션을 입력옵션과 조인하여 페이지네이션으로 조회합니다.
   *
   * @param productId 조회할 상품의 아이디
   * @param paginationDto 페이지네이션 요청 객체
   *
   */
  async getRequiredOptionJoinInputOptions(productId: number, paginationDto: PaginationDto) {
    const { skip, take } = getOffset(paginationDto);

    const data = await this.prisma.productRequiredOption.findMany({
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
        isSale: true,
        productInputOptions: {
          select: {
            id: true,
            productRequiredOptionId: true,
            name: true,
            value: true,
            description: true,
            isRequired: true,
          },
        },
      },
      where: { productId, isSale: true },
      orderBy: { id: 'asc' },
      skip,
      take,
    });

    if (!data.length) {
      throw new ProductRequiredOptionsNotFoundException();
    }
    const count = await this.prisma.productRequiredOption.count({ where: { isSale: true } });
    return createPaginationResponseDto({ data, skip, take, count });
  }

  /**
   * 해당 productId를 가진 상품 선택옵션을 페이지네이션으로 조회합니다.
   * @param productId 조회할 상품의 아이디
   * @param paginationDto 페이지네이션 요청 객체
   *
   */
  async getProductOptions(productId: number, paginationDto: PaginationDto) {
    const { skip, take } = getOffset(paginationDto);

    const data = await this.prisma.productOption.findMany({
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
        isSale: true,
      },
      where: { productId, isSale: true },
      orderBy: { id: 'asc' },
      skip,
      take,
    });

    const count = await this.prisma.productRequiredOption.count({ where: { isSale: true } });
    return createPaginationResponseDto({ data, skip, take, count });
  }
}
