import { Repository, ILike } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/entities/dtos/create-product.dto';
import { ProductListDto } from 'src/entities/dtos/product-list.dto';
import { ProductDto } from 'src/entities/dtos/product.dto';
import { ProductEntity } from 'src/entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * 상품을 저장합니다.
   * @param sellerId 저장할 판매자의 아이디 입니다.
   * @param createProductDto 저장할 상품의 데이터 입니다.
   */
  async saveProduct(sellerId: number, createProductDto: CreateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.save({
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
    });

    return {
      id: product.id,
      sellerId: product.sellerId,
      bundleId: product.bundleId,
      categoryId: product.categoryId,
      companyId: product.companyId,
      name: product.name,
      isSale: product.isSale,
      description: product.description,
      deliveryType: product.deliveryType,
      deliveryCharge: product.deliveryCharge,
      deliveryFreeOver: product.deliveryFreeOver,
      img: product.img,
    };
  }

  /**
   * 상품의 아이디가 존재하는지 조회합니다.
   * @param id 조회할 상품의 아이디 입니다.
   */
  async getProduct(id: number): Promise<ProductDto | null> {
    return await this.productRepository.findOne({
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
  }

  /**
   * 상품리스트를 페이지 네이션으로 조회합니다.
   * @param search 검색어 옵션 입니다
   * @param categoryId 카테고리 별 조회 옵션 입니다.
   * @param sellerId 판매자 별 조회 옵션 입니다.
   * @param skip 건너뛸 요소의 개수 입니다.
   * @param take 가져올 요소의 개수 입니다.
   */
  async getProductList(
    search: string | undefined | null,
    categoryId: number | undefined | null,
    sellerId: number | undefined | null,
    skip: number,
    take: number,
  ): Promise<[Omit<ProductListDto, 'salePrice'>[], number]> {
    return await this.productRepository.findAndCount({
      select: {
        id: true,
        sellerId: true,
        categoryId: true,
        companyId: true,
        name: true,
        deliveryType: true,
        img: true,
      },
      order: {
        id: 'desc',
      },
      where: {
        isSale: true,
        ...(categoryId && { categoryId }),
        ...(sellerId && { sellerId }),
        ...(search && { name: ILike(`%${search}%`) }),
      },
      skip,
      take,
    });
  }
}
