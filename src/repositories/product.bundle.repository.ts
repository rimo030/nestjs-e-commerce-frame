import { Repository } from 'typeorm';
import { CustomRepository } from 'src/configs/custom-typeorm.decorator';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { CreateProductBundleDto } from 'src/seller/dto/create.product.bundle.dto';

@CustomRepository(ProductBundleEntity)
export class ProductBundleRepository extends Repository<ProductBundleEntity> {
  async saveProductBundle(
    sellerId: number,
    createProductBundleDto: CreateProductBundleDto,
  ): Promise<ProductBundleEntity> {
    return await this.save({ sellerId, ...createProductBundleDto });
  }

  async findById(id: number): Promise<ProductBundleEntity | null> {
    return await this.findOne({ where: { id } });
  }
}
