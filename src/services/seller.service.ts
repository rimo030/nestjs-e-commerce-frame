import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateProductBundleDto } from 'src/dtos/create-product-bundle.dto';
import { CreateProductOptionsDto } from 'src/dtos/create-product-options.dto';
import { CreateProductDto } from 'src/dtos/create-product.dto';
import { GetPaginationDto } from 'src/dtos/get-pagination.dto';
import { GetProductOptionsPaginationDto } from 'src/dtos/get-product-option-pagination.dto';
import { GetProductPaginationDto } from 'src/dtos/get-product-pagination.dto';
import { IsRequireOptionDto } from 'src/dtos/is-require-options.dto';
import { ProductBundleDto } from 'src/dtos/product-bundle.dto';
import { ProductOptionDto } from 'src/dtos/product-option.dto';
import { ProductRequiredOptionDto } from 'src/dtos/product-required-option.dto';
import { ProductDto } from 'src/dtos/product.dto';
import { SellerNotfoundException } from 'src/exceptions/auth.exception';
import { ProductBundleNotFoundException, ProductNotFoundException } from 'src/exceptions/product.exception';
import { ProductUnauthrizedException } from 'src/exceptions/seller.exception';
import { PaginationResponse } from 'src/interfaces/pagination-response.interface';
import { getOffset } from 'src/util/functions/pagination-util.function';
import { PrismaService } from './prisma.service';

@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 실제 등록된 판매자 아이디인지 확인합니다.
   * @param sellerId
   */
  async isSeller(sellerId: number): Promise<void> {
    const seller = await this.prisma.seller.findUnique({ select: { id: true }, where: { id: sellerId } });
    if (!seller) {
      throw new SellerNotfoundException();
    }
  }

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
    await this.isSeller(sellerId);

    const productBundle = await this.prisma.productBundle.create({
      select: { id: true, name: true, sellerId: true, chargeStandard: true },
      data: { sellerId, name: createProductBundleDto.name, chargeStandard: createProductBundleDto.chargeStandard },
    });
    return productBundle;
  }

  /**
   * 상품을 생성합니다.
   *
   * @param sellerId 판매자 계정의 아이디가 있어야 상품 묶음을 저장할 수 있습니다.
   * @param createProductDto 저장할 상품의 데이터 입니다.
   *
   */
  async createProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductDto> {
    await this.isSeller(sellerId);

    const product = await this.prisma.product.create({
      select: {
        id: true,
        sellerId: true,
        bundleId: true,
        categoryId: true,
        companyId: true,
        name: true,
        isSale: true,
        description: true,
        deliveryType: true,
        deliveryCharge: true,
        deliveryFreeOver: true,
        img: true,
      },
      data: {
        sellerId,
        bundleId: createProductDto.bundleId,
        categoryId: createProductDto.categoryId,
        companyId: createProductDto.companyId,
        name: createProductDto.name,
        isSale: createProductDto.isSale,
        description: createProductDto.description,
        deliveryType: createProductDto.deliveryType,
        deliveryCharge: createProductDto.deliveryCharge,
        deliveryFreeOver: createProductDto.deliveryFreeOver,
        img: createProductDto.img,
      },
    });
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
    const savedProduct = await this.prisma.product.findUnique({ select: { sellerId: true }, where: { id: productId } });

    if (!savedProduct) {
      throw new ProductNotFoundException();
    }

    if (savedProduct.sellerId !== sellerId) {
      throw new ProductUnauthrizedException();
    }

    if (isRequireOptionDto.isRequire) {
      const requiredOption = await this.prisma.productRequiredOption.create({
        select: { id: true, productId: true, name: true, price: true, isSale: true },
        data: {
          productId,
          name: createProductOptionsDto.name,
          price: createProductOptionsDto.price,
          isSale: createProductOptionsDto.isSale,
        },
      });
      return requiredOption;
    } else {
      const option = await this.prisma.productOption.create({
        select: { id: true, productId: true, name: true, price: true, isSale: true },
        data: {
          productId,
          name: createProductOptionsDto.name,
          price: createProductOptionsDto.price,
          isSale: createProductOptionsDto.isSale,
        },
      });
      return option;
    }
  }

  /**
   * 상품 묶음을 조회합니다.
   * @param bundleId 조회할 상품 묶음의 아이디 입니다.
   */
  async getProductBundle(bundleId: number): Promise<ProductBundleDto> {
    const productBundle = await this.prisma.productBundle.findUnique({
      select: { id: true, sellerId: true, name: true, chargeStandard: true },
      where: { id: bundleId },
    });

    if (!productBundle) {
      throw new ProductBundleNotFoundException();
    }
    return productBundle;
  }

  /**
   * 등록한 상품 묶음을 페이지네이션으로 조회합니다.
   *
   * @param sellerId 조회할 판매자의 아이디 입니다.
   * @param getPaginationDto 페이지네이션 요청 객체 입니다.
   */
  async getProductBundles(
    sellerId: number,
    getPaginationDto: GetPaginationDto,
  ): Promise<PaginationResponse<ProductBundleDto>> {
    await this.isSeller(sellerId);

    const { skip, take } = getOffset(getPaginationDto);

    const [data, count] = await Promise.all([
      this.prisma.productBundle.findMany({
        select: { id: true, sellerId: true, name: true, chargeStandard: true },
        where: { sellerId },
        skip,
        take,
      }),
      this.prisma.productBundle.count({ where: { sellerId } }),
    ]);
    return { data, count, skip, take };
  }

  /**
   * 등록한 상품을 페이지네이션으로 조회합니다.
   * @param sellerId 조회할 판매자의 아이디 입니다.
   * @param getProductPaginationDto 검색 쿼리 및 페이지 네이션 요청 객체 입니다.
   */
  async getProducts(
    sellerId: number,
    getProductPaginationDto: GetProductPaginationDto,
  ): Promise<PaginationResponse<ProductDto>> {
    const {
      bundleId,
      categoryId,
      companyId,
      name,
      description,
      isSale,
      deliveryType,
      deliveryFreeOver,
      deliveryCharge,
      page,
      limit,
    } = getProductPaginationDto;
    await this.isSeller(sellerId);

    const { skip, take } = getOffset({ page, limit });

    const productWhereInput: Prisma.ProductWhereInput = {
      sellerId,
      ...(bundleId !== undefined && { bundleId }),
      ...(categoryId && { categoryId }),
      ...(companyId && { companyId }),
      ...(name && { name: { contains: name } }),
      ...(description !== undefined && description === null
        ? { description }
        : { description: { contains: description } }),
      ...(isSale !== undefined && { isSale }),
      ...(deliveryType && { deliveryType }),
      ...(deliveryFreeOver !== undefined && { deliveryFreeOver }),
      ...(deliveryCharge && { deliveryCharge }),
    };

    const [data, count] = await Promise.all([
      this.prisma.product.findMany({
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
        orderBy: {
          id: 'desc',
        },
        where: productWhereInput,
        skip,
        take,
      }),
      this.prisma.product.count({
        where: productWhereInput,
      }),
    ]);

    return { data, count, skip, take };
  }

  /**
   *등록한 상품 필수/선택옵션을 페이지네이션으로 조회합니다.

   * @param sellerId 조회할 판매자의 아이디 입니다.
   * @param productId 옵션을 조회하려는 상품의 아이디 입니다.
   * @param isRequireOptionDto 상품 필수 옵션의 여부 입니다. fasle라면 상품 선택 옵션이 조회되어야 합니다.
   * @param getProductOptionsPaginationDto 상품 옵션 검색 및 페이지네이션 요청 객체 입니다.
   */
  async getProductOptions(
    sellerId: number,
    productId: number,
    isRequireOptionDto: IsRequireOptionDto,
    getProductOptionsPaginationDto: GetProductOptionsPaginationDto,
  ): Promise<PaginationResponse<ProductRequiredOptionDto | ProductOptionDto>> {
    return 1 as any;
  }
}
