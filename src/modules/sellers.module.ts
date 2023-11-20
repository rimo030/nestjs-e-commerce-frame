import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductsBundleRespository } from 'src/repositories/products.bundle.repository';
import { ProductsRespository } from 'src/repositories/products.repository';
import { SellerController } from '../controllers/sellers.controller';
import { SellerService } from '../services/sellers.service';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([ProductsRespository, ProductsBundleRespository])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
