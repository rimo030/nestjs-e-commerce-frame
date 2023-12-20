import { Repository } from 'typeorm';
import { GetProductDto } from 'src/entities/dtos/get-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { CustomRepository } from '../configs/custom-typeorm.decorator';

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async getProduct(id: number): Promise<GetProductDto | null> {
    return await this.findOne({
      select: {
        id: true,
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
      where: {
        id,
      },
    });
  }
}
