import { Repository } from 'typeorm';
import { CustomRepository } from 'src/configs/custom-typeorm.decorator';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { ProductBundleDto } from 'src/entities/dtos/product-bundle.dto';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';

@CustomRepository(ProductBundleEntity)
export class ProductBundleRepository extends Repository<ProductBundleEntity> {
  async saveProductBundle(
    sellerId: number,
    createProductBundleDto: CreateProductBundleDto,
  ): Promise<ProductBundleEntity> {
    return await this.save({ sellerId, ...createProductBundleDto });
  }

  async getProductBundle(id: number): Promise<ProductBundleDto | null> {
    return await this.findOne({
      select: { id: true, sellerId: true, name: true, chargeStandard: true },
      where: { id },
    });
  }
}
