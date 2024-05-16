import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuyerEntity } from 'src/entities/buyer.entity';
import { ProductBundleEntity } from 'src/entities/product-bundle.entity';
import { ProductOptionEntity } from 'src/entities/product-option.entity';
import { ProductRequiredOptionEntity } from 'src/entities/product-required-option.entity';
import { ProductEntity } from 'src/entities/product.entity';
import { SellerEntity } from 'src/entities/seller.entity';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from '../services/seller.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SellerEntity,
      BuyerEntity,
      ProductBundleEntity,
      ProductEntity,
      ProductRequiredOptionEntity,
      ProductOptionEntity,
    ]),
  ],
  controllers: [SellerController],
  providers: [
    SellerService,
    ProductBundleRepository,
    ProductRepository,
    ProductRequiredOptionRepository,
    ProductOptionRepository,
    SellerRepository,
  ],
})
export class SellerModule {}
