import { Module } from '@nestjs/common';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';
import { ProductsBundleRespository } from 'src/repositories/products.bundle.repository';
import { ProductsOptionRespository } from 'src/repositories/products.option.repository';
import { ProductsRespository } from 'src/repositories/products.repository';
import { ProductsRequiredRespository } from 'src/repositories/products.required.option.repository';
import { SellerController } from '../controllers/sellers.controller';
import { SellerService } from '../services/sellers.service';

@Module({
  imports: [
    CustomTypeOrmModule.forCustomRepository([
      ProductsRespository,
      ProductsBundleRespository,
      ProductsRequiredRespository,
      ProductsOptionRespository,
    ]),
  ],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
