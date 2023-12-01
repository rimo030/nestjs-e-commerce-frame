import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductBundleRepository } from 'src/repositories/product.bundle.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ProductRepository])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
