import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductBundleRepository } from 'src/repositories/product.bundle.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from '../services/seller.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ProductRepository, ProductBundleRepository])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
