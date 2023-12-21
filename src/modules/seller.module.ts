import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductBundleRepository } from 'src/repositories/product-bundle.repository';
import { ProductOptionRepository } from 'src/repositories/product-option-repository';
import { ProductRequiredOptionRepository } from 'src/repositories/product-required-option.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { SellerRepository } from 'src/repositories/seller.repository';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from '../services/seller.service';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      SellerRepository,
      ProductRepository,
      ProductBundleRepository,
      ProductRequiredOptionRepository,
      ProductOptionRepository,
    ]),
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
