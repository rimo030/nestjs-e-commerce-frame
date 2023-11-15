import { Module } from '@nestjs/common';
import { SellerController } from '../controllers/seller.controller';
import { SellerService } from '../services/seller.service';
import { SellerRespository } from 'src/repositories/seller.repository';
import { CustomTypeOrmModule } from 'src/configs/custom-typeorm.module';

@Module({
  imports: [CustomTypeOrmModule.forCustomRepository([SellerRespository])],
  controllers: [SellerController],
  providers: [SellerService],
})
export class SellerModule {}
