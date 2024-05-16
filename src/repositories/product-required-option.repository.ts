import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { ProductRequiredOptionDto } from 'src/entities/dtos/product-required-option.dto';
import { ProductRequiredOptionJoinInputOptionDto } from 'src/entities/dtos/product-rquired-option-join-input-option.dto';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';

@Injectable()
export class ProductRequiredOptionRepository {
  constructor(
    @InjectRepository(ProductRequiredOptionEntity)
    private productRequiredOptionRepository: Repository<ProductRequiredOptionEntity>,
  ) {}

  /**
   * 상품 필수 옵션을 저장합니다.
   * @param productId 상품 필수 옵션을 저장할 상품의 아이디 입니다.
   * @param createProductOptionsDto 저장할 상품 필수 옵션의 데이터 입니다.
   */
  async saveRequiredOption(
    productId: number,
    createProductOptionsDto: CreateProductOptionsDto,
  ): Promise<ProductRequiredOptionDto> {
    const productRequiredOption = await this.productRequiredOptionRepository.save({
      productId,
      name: createProductOptionsDto.name,
      price: createProductOptionsDto.price,
      isSale: createProductOptionsDto.isSale,
    });

    return {
      id: productRequiredOption.id,
      productId: productRequiredOption.productId,
      name: productRequiredOption.name,
      price: productRequiredOption.price,
      isSale: productRequiredOption.isSale,
    };
  }

  /**
   * 상품 필수 옵션을 조회합니다.
   * @param id 조회할 상품 필수옵션의 아이디 입니다.
   */
  async getRequiredOption(id: number): Promise<ProductRequiredOptionDto | null> {
    return await this.productRequiredOptionRepository.findOne({
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
        isSale: true,
      },
      where: {
        id,
      },
    });
  }

  /**
   *상품의 최소 가격(필수 옵션 중 가장 저렴한 옵션)을 조회합니다.
   * @param productIds 조회할 상품들의 아이디 입니다.
   */
  async getMiniumPriceRows(productIds: number[]): Promise<{ productId: number; minimumPrice: number }[]> {
    return await this.productRequiredOptionRepository
      .createQueryBuilder('pro')
      .select('pro.productId as productId')
      .addSelect('MIN(pro.price) as minimumPrice')
      .where('pro.productId IN (:...productIds)', { productIds })
      .groupBy('pro.productId')
      .getRawMany();
  }

  /**
   * 상품의 필수 옵션을 페이지 네이션으로 조회합니다.
   * @param productId 조회할 상품의 아이디 입니다.
   * @param skip 건너뛸 요소의 개수 입니다.
   * @param take 가져올 요소의 개수 입니다.
   */
  async getRequiredOptionJoinInputOptions(
    productId: number,
    skip: number,
    take: number,
  ): Promise<[ProductRequiredOptionJoinInputOptionDto[], number]> {
    return await this.productRequiredOptionRepository.findAndCount({
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
        isSale: true,
        productInputOptions: {
          id: true,
          productRequiredOptionId: true,
          name: true,
          value: true,
          description: true,
          isRequired: true,
        },
      },
      where: { productId, isSale: true },
      order: { id: 'asc' },
      skip,
      take,
    });
  }
}
