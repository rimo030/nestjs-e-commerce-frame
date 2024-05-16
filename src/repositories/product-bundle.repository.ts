import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { ProductBundleDto } from 'src/entities/dtos/product-bundle.dto';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';

@Injectable()
export class ProductBundleRepository {
  constructor(
    @InjectRepository(ProductBundleEntity)
    private productBundleRepository: Repository<ProductBundleEntity>,
  ) {}

  /**
   * 상품 묶음을 저장합니다.
   * @param sellerId 저장할 판매자의 아이디 입니다.
   * @param createProductBundleDto  저장할 묶음의 정보 입니다.
   */
  async saveProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<ProductBundleDto> {
    const productBundle = await this.productBundleRepository.save({
      sellerId,
      name: createProductBundleDto.name,
      chargeStandard: createProductBundleDto.chargeStandard,
    });

    return {
      id: productBundle.id,
      sellerId: productBundle.sellerId,
      name: productBundle.name,
      chargeStandard: productBundle.chargeStandard,
    };
  }

  /**
   * 해당 아이디를 가진 상품 묶음을 조회합니다.
   * @param id 조회할 상품 묶음의 아이디 입니다.
   */
  async getProductBundle(id: number): Promise<ProductBundleDto | null> {
    const productBundle = await this.productBundleRepository.findOne({
      select: { id: true, sellerId: true, name: true, chargeStandard: true },
      where: { id },
    });

    return productBundle
      ? {
          id: productBundle.id,
          sellerId: productBundle.sellerId,
          name: productBundle.name,
          chargeStandard: productBundle.chargeStandard,
        }
      : null;
  }
}
