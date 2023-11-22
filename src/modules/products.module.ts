import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductsBundleRespository } from 'src/repositories/products.bundle.repository';
import { ProductsRespository } from 'src/repositories/products.repository';
import { ProductController } from '../controllers/products.controller';
import { ProductService } from '../services/products.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ProductsRespository])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
