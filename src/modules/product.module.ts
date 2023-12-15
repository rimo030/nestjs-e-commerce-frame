import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/products.required.option.repository';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      ProductRepository,
      ProductRequiredOptionRepository,
      ProductOptionRepository,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
