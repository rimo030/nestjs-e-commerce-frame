import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from '../services/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductBundleEntity, ProductEntity, ProductRequiredOptionEntity, ProductOptionEntity]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductBundleRepository,
    ProductRepository,
    ProductRequiredOptionRepository,
    ProductOptionRepository,
  ],
})
export class ProductModule {}
