import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductBundleRepository } from 'src/repositories/product.bundle.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductController } from '../controllers/products.controller';
import { ProductService } from '../services/products.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ProductRepository])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
