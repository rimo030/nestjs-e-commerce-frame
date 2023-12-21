import { Repository } from 'typeorm';
import { CreateProductBundleDto } from 'src/entities/dtos/create-product-bundle.dto';
import { GetProductBundleDto } from 'src/entities/dtos/get-product-bundle.dto';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductBundleEntity)
export class ProductBundleRepository extends Repository<ProductBundleEntity> {
  async createProductBundle(sellerId: number, createProductBundleDto: CreateProductBundleDto): Promise<{ id: number }> {
    const { id, ...other } = await this.save({ sellerId, ...createProductBundleDto });
    return { id };
  }

  async getProductBundle(id: number): Promise<GetProductBundleDto | null> {
    return this.findOne({
      select: {
        id: true,
        name: true,
        chargeStandard: true,
      },
      where: {
        id,
      },
    });
  }
}
