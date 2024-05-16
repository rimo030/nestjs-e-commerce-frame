import { Injectable } from '@nestjs/common';
import { GetPaginationDto } from 'src/entities/dtos/get-pagination.dto';
import { GetProductListPaginationDto } from 'src/entities/dtos/get-product-list-pagination.dto';
import { IsRequireOptionDto } from 'src/entities/dtos/is-require-options.dto';
import { ProductListDto } from 'src/entities/dtos/product-list.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductRequiredOptionDto } from 'src/entities/dtos/product-required-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from 'src/entities/dtos/product-rquired-option-join-input-option.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import {
  ProductNotFoundException,
  ProductRequiredOptionNotFoundException,
  ProductOptionNotFoundException,
  ProductsNotFoundException,
  ProductRequiredOptionsNotFoundException,
} from 'src/exceptions/product.exception';
import { PaginationResponse } from 'src/interfaces/pagination-response.interface';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { getOffset } from 'src/util/functions/pagination-util.function';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productRequiredOptionRepository: ProductRequiredOptionRepository,
    private readonly productOptionRepository: ProductOptionRepository,
  ) {}

  /**
   * 상품의 정보를 조회합니다.
   * @param id 조회할 상품의 아이디 입니다.
   */
  async getProduct(id: number): Promise<ProductDto> {
    const product = await this.productRepository.getProduct(id);

    if (!product) {
      throw new ProductNotFoundException();
    }
    return product;
  }

  /**
   * 상품 필수 옵션을 조회합니다.
   * @param requiredOptionId 조회할 상품 필수 옵션의 아이디 입니다.
   */
  async getProductRequiredOptionById(requiredOptionId: number): Promise<ProductRequiredOptionDto> {
    const requiredOption = await this.productRequiredOptionRepository.getRequiredOption(requiredOptionId);

    if (!requiredOption) {
      throw new ProductRequiredOptionNotFoundException();
    }
    return requiredOption;
  }

  /**
   * 상품 선택 옵션을 조회합니다.
   * @param optionId 조회할 상품 선택 옵션의 아이디 입니다.
   */
  async getProductOptionById(optionId: number): Promise<ProductOptionDto> {
    const option = await this.productOptionRepository.getOption(optionId);
    if (!option) {
      throw new ProductOptionNotFoundException();
    }
    return option;
  }

  /**
   * 상품의 목록과 최소 가격을 페이지네이션으로 조회합니다.
   * 상품명, 카테고리명, 판매자ID 검색 쿼리를 설정할 수 있습니다.
   *
   * @param getProductListPaginationDto 요청 쿼리 객체 입니다.
   */
  async getProductListWithMiniumPrice(
    getProductListPaginationDto: GetProductListPaginationDto,
  ): Promise<PaginationResponse<ProductListDto>> {
    const { data, skip, take, count } = await this.getProductList(getProductListPaginationDto);

    const productIds = data.map((d) => d.id);
    const miniumPriceRows = await this.getMinimumPriceRows(productIds);

    const productList = data.map((d) => {
      const salePrice = miniumPriceRows.find((r) => r.productId === d.id)?.minimumPrice ?? 0;
      return { ...d, salePrice };
    });

    return { data: productList, skip, take, count };
  }

  /**
   * 상품들의 최소 가격을 계산하여 반환합니다.
   * 조회되지 않는다면 0원으로 설정됩니다.
   *
   * @param productIds 상품의 아이디 배열입니다.
   */
  async getMinimumPriceRows(productIds: number[]) {
    const minimumPriceRows = await this.productRequiredOptionRepository.getMiniumPriceRows(productIds);

    return minimumPriceRows.map((row) => ({
      productId: row.productId,
      minimumPrice: row.minimumPrice ?? 0,
    }));
  }

  /**
   * 상품의 정보를 페이지 네이션으로 조회합니다.
   * 상품명, 카테고리명, 판매자ID 검색 쿼리를 설정할 수 있습니다.
   *
   * @param getProductListPaginationDto 요청 쿼리 객체 입니다.
   *
   */
  async getProductList(
    getProductListPaginationDto: GetProductListPaginationDto,
  ): Promise<PaginationResponse<Omit<ProductListDto, 'salePrice'>>> {
    const { page, limit, search, categoryId, sellerId } = getProductListPaginationDto;
    const { skip, take } = getOffset({ page, limit });

    const [data, count] = await this.productRepository.getProductList(search, categoryId, sellerId, skip, take);

    if (!data.length) {
      throw new ProductsNotFoundException();
    }
    return { data, skip, count, take };
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
    paginationDto: GetPaginationDto,
  ): Promise<PaginationResponse<ProductOptionDto | ProductRequiredOptionJoinInputOptionDto>> {
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
   */
  async getRequiredOptionJoinInputOptions(
    productId: number,
    paginationDto: GetPaginationDto,
  ): Promise<PaginationResponse<ProductRequiredOptionJoinInputOptionDto>> {
    const { skip, take } = getOffset(paginationDto);
    const [data, count] = await this.productRequiredOptionRepository.getRequiredOptionJoinInputOptions(
      productId,
      skip,
      take,
    );

    if (!data.length) {
      throw new ProductRequiredOptionsNotFoundException();
    }
    return { data, skip, take, count };
  }

  /**
   * 해당 productId를 가진 상품 선택옵션을 페이지네이션으로 조회합니다.
   *
   * @param productId 조회할 상품의 아이디
   * @param paginationDto 페이지네이션 요청 객체
   */
  async getProductOptions(
    productId: number,
    paginationDto: GetPaginationDto,
  ): Promise<PaginationResponse<ProductOptionDto>> {
    const { skip, take } = getOffset(paginationDto);
    const [data, count] = await this.productOptionRepository.getProductOptions(productId, skip, take);
    return { data, skip, take, count };
  }
}
