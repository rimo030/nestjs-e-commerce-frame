import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductOptionsDto } from 'src/entities/dtos/create-product-options.dto';
import { ProductOptionDto } from 'src/entities/dtos/product-option.dto';
import { ProductOptionEntity } from 'src/entities/product-option.entity';

@Injectable()
export class ProductOptionRepository {
  constructor(
    @InjectRepository(ProductOptionEntity)
    private productOptionRepository: Repository<ProductOptionEntity>,
  ) {}

  /**
   * 상품 선택 옵션을 저장합니다.
   * @param productId 저장할 상품 선택 옵션의 상품 입니다.
   * @param createProductOptionsDto  저장할 상품 선택 옵션의 데이터 입니다.
   */
  async saveOption(productId: number, createProductOptionsDto: CreateProductOptionsDto): Promise<ProductOptionDto> {
    const productOption = await this.productOptionRepository.save({
      productId,
      name: createProductOptionsDto.name,
      price: createProductOptionsDto.price,
      isSale: createProductOptionsDto.isSale,
    });

    return {
      id: productOption.id,
      productId: productOption.productId,
      name: productOption.name,
      price: productOption.price,
      isSale: productOption.isSale,
    };
  }

  /**
   * 상품 선택 옵션을 조회합니다.
   * @param id 조회할 상품 선택 옵션 입니다.
   */
  async getOption(id: number): Promise<ProductOptionDto | null> {
    return await this.productOptionRepository.findOne({
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
   * 상품의 선택 옵션을 페이지 네이션으로 조회합니다.
   * @param productId 조회할 상품의 아이디 입니다.
   * @param skip 건너뛸 요소의 개수 입니다.
   * @param take 가져올 요소의 개수 입니다.
   */
  async getProductOptions(productId: number, skip: number, take: number): Promise<[ProductOptionDto[], number]> {
    return await this.productOptionRepository.findAndCount({
      select: {
        id: true,
        productId: true,
        name: true,
        price: true,
        isSale: true,
      },
      where: { productId, isSale: true },
      order: { id: 'asc' },
      skip,
      take,
    });
  }
}
