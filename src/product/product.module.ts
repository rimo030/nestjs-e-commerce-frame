import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductInputOptionRepository } from 'src/repositories/product.input.option.repository';
import { ProductOptionRepository } from 'src/repositories/product.option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product.required.option.repository';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      ProductRepository,
      ProductRequiredOptionRepository,
      ProductOptionRepository,
      ProductInputOptionRepository,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
